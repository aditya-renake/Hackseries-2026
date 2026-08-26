import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initFirebase } from './config/firebase.js';
import { staffRepo } from './models/staffRepo.js';
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

// Firebase Firestore Initialization Middleware
let dbInitialized = false;
export const ensureFirestoreReady = async (req, res, next) => {
  try {
    if (!dbInitialized) {
      initFirebase();
      await staffRepo.seedDefaultAdmin();
      dbInitialized = true;
    }
    if (next) next();
  } catch (err) {
    console.error('Firestore initialization notice:', err.message);
    if (next) next();
  }
};

app.use(ensureFirestoreReady);

// Mount Routes
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
    database: 'Google Cloud Firestore',
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
