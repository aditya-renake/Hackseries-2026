import express from 'express';
import { getEventConfig, updateEventConfig } from '../controllers/eventController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public event info
router.get('/', getEventConfig);

// Admin update event settings
router.put('/', requireAuth, requireAdmin, updateEventConfig);

export default router;
