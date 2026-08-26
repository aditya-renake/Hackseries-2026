import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { ddbDocClient, TABLE_NAMES } from '../config/dynamodb.js';

export const staffRepo = {
  /**
   * Find staff user by username
   */
  async findByUsername(username) {
    if (!username) return null;
    const cleanUsername = username.toLowerCase().trim();

    try {
      const res = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLE_NAMES.STAFF,
          Key: { username: cleanUsername },
        })
      );
      return res.Item || null;
    } catch (e) {
      console.warn('[staffRepo] findByUsername notice:', e.message);
      return null;
    }
  },

  /**
   * Find staff user by email (using GSI or Scan fallback)
   */
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const res = await ddbDocClient.send(
        new QueryCommand({
          TableName: TABLE_NAMES.STAFF,
          IndexName: 'staff-email-index',
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
    } catch (e) {
      // Fallback scan if GSI is not yet active
      const scanRes = await ddbDocClient.send(
        new ScanCommand({
          TableName: TABLE_NAMES.STAFF,
          FilterExpression: 'email = :emailVal',
          ExpressionAttributeValues: { ':emailVal': cleanEmail },
        })
      );
      if (scanRes.Items && scanRes.Items.length > 0) {
        return scanRes.Items[0];
      }
    }
    return null;
  },

  /**
   * Find staff user by either username or email
   */
  async findByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.toLowerCase().trim();

    // Check username first
    const byUsername = await this.findByUsername(clean);
    if (byUsername) return byUsername;

    // Check email
    return this.findByEmail(clean);
  },

  /**
   * Create staff user with hashed password
   */
  async createStaff({ username, email, name, password, role = 'admin' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash,
      role,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAMES.STAFF,
        Item: user,
      })
    );

    return user;
  },

  /**
   * Verify password against bcrypt hash
   */
  async verifyPassword(candidatePassword, passwordHash) {
    if (!candidatePassword || !passwordHash) return false;
    return bcrypt.compare(candidatePassword, passwordHash);
  },

  /**
   * Update last login timestamp
   */
  async updateLastLogin(username) {
    if (!username) return;
    try {
      const user = await this.findByUsername(username);
      if (user) {
        user.lastLogin = new Date().toISOString();
        await ddbDocClient.send(
          new PutCommand({
            TableName: TABLE_NAMES.STAFF,
            Item: user,
          })
        );
      }
    } catch (e) {
      console.warn('[staffRepo] updateLastLogin error:', e.message);
    }
  },

  /**
   * Seed default admin user (adityarenake / Aditya@11) if none exists
   */
  async seedDefaultAdmin() {
    try {
      const existing = await this.findByUsername('adityarenake');
      if (!existing) {
        console.log('👑 [DynamoDB] Seeding default admin account (adityarenake)...');
        await this.createStaff({
          username: 'adityarenake',
          email: 'aditya.renake@outlook.com',
          name: 'Aditya Renake',
          password: 'Aditya@11',
          role: 'admin',
        });
        console.log('✅ [DynamoDB] Default admin created successfully.');
      }
    } catch (e) {
      console.warn('⚠️ [DynamoDB] Admin seed notice:', e.message);
    }
  },
};
