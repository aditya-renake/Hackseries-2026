import { getFirestore } from '../config/firebase.js';

export const registrantRepo = {
  getCollection() {
    const db = getFirestore();
    return db.collection('registrants');
  },

  /**
   * Create or overwrite registrant document in Firestore
   */
  async create(data) {
    const collection = this.getCollection();
    const cleanId = data.uniqueId.toUpperCase().trim();
    const item = {
      ...data,
      _id: cleanId,
      uniqueId: cleanId,
      email: data.email.toLowerCase().trim(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collection.doc(cleanId).set(item);
    return item;
  },

  /**
   * Find registrant by uniqueId
   */
  async findByUniqueId(uniqueId) {
    if (!uniqueId) return null;
    const cleanId = uniqueId.toUpperCase().trim();
    const collection = this.getCollection();

    const doc = await collection.doc(cleanId).get();
    if (doc.exists) {
      return { _id: doc.id, ...doc.data() };
    }
    return null;
  },

  /**
   * Find registrant by email address
   */
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const collection = this.getCollection();

    const snapshot = await collection.where('email', '==', cleanEmail).limit(1).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { _id: doc.id, ...doc.data() };
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
    const collection = this.getCollection();
    const snapshot = await collection.get();

    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({ _id: doc.id, ...doc.data() });
    });

    // Total counts across all items
    const totalAll = items.length;
    const checkedInCount = items.filter((i) => i.checkedIn).length;
    const emailSentCount = items.filter((i) => i.emailSent).length;

    // Filters
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

    // Sort
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
   * Update registrant document in Firestore
   */
  async update(uniqueId, updates) {
    if (!uniqueId) return null;
    const cleanId = uniqueId.toUpperCase().trim();
    const collection = this.getCollection();

    const existing = await this.findByUniqueId(cleanId);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      uniqueId: cleanId,
      updatedAt: new Date().toISOString(),
    };

    await collection.doc(cleanId).set(merged, { merge: true });
    return merged;
  },

  /**
   * Delete registrant document
   */
  async delete(uniqueId) {
    if (!uniqueId) return false;
    const cleanId = uniqueId.toUpperCase().trim();
    const collection = this.getCollection();
    await collection.doc(cleanId).delete();
    return true;
  },

  /**
   * Get recent check-ins stream for gate monitor
   */
  async getRecentCheckins(limitCount = 20) {
    const collection = this.getCollection();
    const snapshot = await collection.get();

    const items = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.checkedIn) {
        items.push({ _id: doc.id, ...data });
      }
    });

    items.sort((a, b) => new Date(b.checkedInAt || 0) - new Date(a.checkedInAt || 0));
    return items.slice(0, limitCount);
  },

  /**
   * Total stats summary
   */
  async getStats() {
    const collection = this.getCollection();
    const snapshot = await collection.get();

    const items = [];
    snapshot.docs.forEach((doc) => {
      items.push(doc.data());
    });

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
