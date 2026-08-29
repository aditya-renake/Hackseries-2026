import express from 'express';
import { getEventConfig, updateEventConfig, getDatabaseTelemetry } from '../controllers/eventController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public event info
router.get('/', getEventConfig);

// Admin update event settings
router.put('/', requireAuth, requireAdmin, updateEventConfig);

// Admin Real-Time Database Telemetry & Storage Metrics
router.get('/database-telemetry', requireAuth, requireAdmin, getDatabaseTelemetry);

export default router;
