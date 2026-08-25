import { app, ensureDBConnected } from '../backend/src/app.js';
import { seedDatabase } from '../backend/src/utils/seedData.js';

let isSeeded = false;

export default async function handler(req, res) {
  try {
    await ensureDBConnected();

    if (!isSeeded) {
      try {
        await seedDatabase();
      } catch (seedErr) {
        console.warn('Seeding warning:', seedErr.message);
      }
      isSeeded = true;
    }

    return app(req, res);
  } catch (error) {
    console.error('Serverless Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: `Serverless Handler Error: ${error.message}`,
      error: error.message,
    });
  }
}
