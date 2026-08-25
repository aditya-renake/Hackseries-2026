import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import registrantRoutes from './routes/registrant.routes.js';
import checkinRoutes from './routes/checkin.routes.js';
import emailRoutes from './routes/email.routes.js';
import eventRoutes from './routes/event.routes.js';

dotenv.config();

const app = express();

// Global Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to ensure DB connection is ready (Crucial for Vercel Serverless Functions)
export const ensureDBConnected = async (req, res, next) => {
  try {
    await connectDB();
    if (next) next();
  } catch (err) {
    console.error('Database connection middleware error:', err);
    if (res) {
      return res.status(500).json({ success: false, message: 'Database connection failed' });
    }
  }
};

app.use(ensureDBConnected);

// Mount Routes (supporting both /api/* and /* for maximum serverless compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/registrants', registrantRoutes);
app.use('/registrants', registrantRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/checkin', checkinRoutes);
app.use('/api/email', emailRoutes);
app.use('/email', emailRoutes);
app.use('/api/event', eventRoutes);
app.use('/event', eventRoutes);

// Health check
app.get(['/api/health', '/health', '/api'], (req, res) => {
  res.json({
    status: 'online',
    event: 'HackSeries 2026',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use(errorHandler);

export { app };
export default app;
