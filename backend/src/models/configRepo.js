import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, TABLE_NAMES } from '../config/dynamodb.js';

const CONFIG_KEY = 'MAIN_EVENT_2026';

const DEFAULT_CONFIG = {
  configKey: CONFIG_KEY,
  eventName: 'HackSeries 2026',
  eventTagline: 'Presented by ACES — Dept. of Computer Engineering, Dr. D. Y. Patil Institute of Technology, Pimpri, Pune (DYPDPU)',
  eventDate: 'October 16 - 18, 2026',
  eventTime: '09:00 AM IST (Gate Check-in starts 07:30 AM)',
  eventVenue: 'Dr. D. Y. Patil Institute of Technology (DIT), Sant Tukaram Nagar, Pimpri, Pune - 411018',
  organizerEmail: 'aditya.renake@outlook.com',
  organizerName: 'ACES (Association of Computer Engineering Students), DIT Pune',
  googleFormUrl: 'https://forms.gle/U24ip7E6NqtbZkiT9',
  emailSubjectTemplate: '🎟️ Your Official Entry Pass for HackSeries 2026 — {{name}}',
  emailBodyNotice: 'Please present this digital pass with QR code at the registration desk for express check-in and hacker kit collection.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const configRepo = {
  /**
   * Fetch current event configuration
   */
  async getConfig() {
    try {
      const res = await ddbDocClient.send(
        new GetCommand({
          TableName: TABLE_NAMES.CONFIG,
          Key: { configKey: CONFIG_KEY },
        })
      );

      if (res.Item) {
        return res.Item;
      }

      // If not yet present in DynamoDB, seed default and return
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLE_NAMES.CONFIG,
          Item: DEFAULT_CONFIG,
        })
      );
      return DEFAULT_CONFIG;
    } catch (e) {
      console.warn('[configRepo] getConfig notice:', e.message);
      return DEFAULT_CONFIG;
    }
  },

  /**
   * Update event configuration
   */
  async updateConfig(updates) {
    const current = await this.getConfig();
    const merged = {
      ...current,
      ...updates,
      configKey: CONFIG_KEY,
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAMES.CONFIG,
        Item: merged,
      })
    );

    return merged;
  },
};
