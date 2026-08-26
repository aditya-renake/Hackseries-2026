import { app } from './app.js';
import { initDynamoDB } from './config/dynamodb.js';
import { staffRepo } from './models/staffRepo.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await initDynamoDB();
  await staffRepo.seedDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`
══════════════════════════════════════════════════════════════
🚀 HackSeries 2026 Backend Engine Online!
🗄️ Database: AWS DynamoDB
🌐 API URL: http://localhost:${PORT}
⚡ Webhook: http://localhost:${PORT}/api/registrants/webhook
🛡️ Anti-Forgery Cryptographic QR System: ACTIVE
📧 Email Sender: ${process.env.SMTP_USER || 'aditya.renake@outlook.com'}
══════════════════════════════════════════════════════════════
    `);
  });
};

startServer();
