import { app, ensureDBConnected } from '../backend/src/app.js';
import { seedDatabase } from '../backend/src/utils/seedData.js';

let isSeeded = false;

export default async function handler(req, res) {
  await ensureDBConnected();

  if (!isSeeded) {
    await seedDatabase();
    isSeeded = true;
  }

  return app(req, res);
}
