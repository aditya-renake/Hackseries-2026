import { app } from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`
══════════════════════════════════════════════════════════════
🚀 HackSeries 2026 Backend Engine Online!
🌐 API URL: http://localhost:${PORT}
⚡ Webhook: http://localhost:${PORT}/api/registrants/webhook
🛡️ Anti-Forgery Cryptographic QR System: ACTIVE
📧 Email Sender: ${process.env.SMTP_USER || 'aditya.renake@outlook.com'}
══════════════════════════════════════════════════════════════
    `);
  });
};

startServer();
