import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, TABLE_NAMES } from '../config/dynamodb.js';

export const registrantRepo = {
  /**
   * Put new registrant item into DynamoDB
   */
  async create(data) {
    const item = {
      ...data,
      _id: data.uniqueId, // compatibility with frontend _id
      uniqueId: data.uniqueId.toUpperCase(),
      email: data.email.toLowerCase().trim(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
        Item: item,
      })
    );

    return item;
  },

  /**
   * Find registrant by uniqueId (Partition Key)
   */
  async findByUniqueId(uniqueId) {
    if (!uniqueId) return null;
    const cleanId = uniqueId.toUpperCase().trim();

    const res = await ddbDocClient.send(
      new GetCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
        Key: { uniqueId: cleanId },
      })
    );

    return res.Item || null;
  },

  /**
   * Find registrant by email using Global Secondary Index (email-index)
   */
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    const res = await ddbDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :emailVal',
        ExpressionAttributeValues: {
          ':emailVal': cleanEmail,
        },
        Limit: 1,
      })
    );

    if (res.Items && res.Items.length > 0) {
      return res.Items[0];
    }
    return null;
  },

  /**
   * Find registrant by either uniqueId or email
   */
  async findByIdOrEmail(query) {
    if (!query) return null;
    const cleanQuery = query.trim();

    if (cleanQuery.includes('@')) {
      return this.findByEmail(cleanQuery);
    }
    return this.findByUniqueId(cleanQuery);
  },

  /**
   * Get all registrants with search, filter, and pagination
   */
  async getAll({
    page = 1,
    limit = 50,
    search = '',
    checkedIn,
    emailSent,
    ticketType,
    track,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = {}) {
    const res = await ddbDocClient.send(
      new ScanCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
      })
    );

    let items = res.Items || [];

    // Client-side filtering across the scanned dataset (or DynamoDB FilterExpression)
    if (checkedIn !== undefined && checkedIn !== '') {
      const isChecked = checkedIn === 'true' || checkedIn === true;
      items = items.filter((item) => Boolean(item.checkedIn) === isChecked);
    }

    if (emailSent !== undefined && emailSent !== '') {
      const isSent = emailSent === 'true' || emailSent === true;
      items = items.filter((item) => Boolean(item.emailSent) === isSent);
    }

    if (ticketType && ticketType !== 'all') {
      items = items.filter((item) => item.ticketType === ticketType);
    }

    if (track && track !== 'all') {
      items = items.filter((item) => item.track === track);
    }

    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim();
      items = items.filter((item) =>
        (item.name && item.name.toLowerCase().includes(s)) ||
        (item.email && item.email.toLowerCase().includes(s)) ||
        (item.phone && item.phone.toLowerCase().includes(s)) ||
        (item.uniqueId && item.uniqueId.toLowerCase().includes(s)) ||
        (item.teamName && item.teamName.toLowerCase().includes(s)) ||
        (item.institution && item.institution.toLowerCase().includes(s))
      );
    }

    // Sort items
    items.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = items.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(skip, skip + limitNum);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Compute stats
    const allRes = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAMES.REGISTRANTS }));
    const allItems = allRes.Items || [];
    const totalAll = allItems.length;
    const checkedInCount = allItems.filter((i) => i.checkedIn).length;
    const emailSentCount = allItems.filter((i) => i.emailSent).length;

    return {
      items: paginatedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: totalCount,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      stats: {
        totalRegistrants: totalAll,
        checkedInCount,
        checkedInPercentage: totalAll > 0 ? Math.round((checkedInCount / totalAll) * 100) : 0,
        emailSentCount,
        pendingEmailCount: totalAll - emailSentCount,
      },
    };
  },

  /**
   * Update registrant attributes
   */
  async update(uniqueId, updates) {
    if (!uniqueId) return null;
    const existing = await this.findByUniqueId(uniqueId);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      uniqueId: existing.uniqueId,
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
        Item: merged,
      })
    );

    return merged;
  },

  /**
   * Delete registrant
   */
  async delete(uniqueId) {
    if (!uniqueId) return false;
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
        Key: { uniqueId: uniqueId.toUpperCase().trim() },
      })
    );
    return true;
  },

  /**
   * Get recent check-ins stream for gate monitor
   */
  async getRecentCheckins(limitCount = 20) {
    const res = await ddbDocClient.send(
      new ScanCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
      })
    );

    const items = (res.Items || [])
      .filter((i) => i.checkedIn)
      .sort((a, b) => new Date(b.checkedInAt || 0) - new Date(a.checkedInAt || 0))
      .slice(0, limitCount);

    return items;
  },

  /**
   * Get total stats summary
   */
  async getStats() {
    const res = await ddbDocClient.send(
      new ScanCommand({
        TableName: TABLE_NAMES.REGISTRANTS,
      })
    );

    const items = res.Items || [];
    const totalRegistrants = items.length;
    const checkedInCount = items.filter((i) => i.checkedIn).length;
    const emailSentCount = items.filter((i) => i.emailSent).length;

    return {
      totalRegistrants,
      checkedInCount,
      checkedInPercentage: totalRegistrants > 0 ? Math.round((checkedInCount / totalRegistrants) * 100) : 0,
      emailSentCount,
      pendingEmailCount: totalRegistrants - emailSentCount,
    };
  },
};
