import express from 'express';
import {
  getRegistrants,
  handleWebhookSubmission,
  createRegistrant,
  getPublicPass,
  getRegistrantById,
  regenerateQR,
  deleteRegistrant,
  exportCSV,
} from '../controllers/registrantController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Primary Intake Webhook from Google Form / Google Apps Script trigger
router.post('/webhook', handleWebhookSubmission);

// Public Digital Pass Lookup (by UniqueId or Email)
router.get('/pass/:idOrEmail', getPublicPass);

// Protected Staff / Admin Routes
router.get('/', requireAuth, getRegistrants);
router.get('/export/csv', requireAuth, exportCSV);
router.get('/:id', requireAuth, getRegistrantById);
router.post('/', requireAuth, createRegistrant);
router.post('/:id/generate-qr', requireAuth, regenerateQR);
router.delete('/:id', requireAuth, requireAdmin, deleteRegistrant);

export default router;
