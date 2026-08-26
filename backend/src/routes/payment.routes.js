import express from 'express';
import { createPaymentOrder, verifyPaymentAndRegister } from '../controllers/paymentController.js';

const router = express.Router();

// Create Razorpay / Gateway Order
router.post('/create-order', createPaymentOrder);

// Verify Payment & Generate Pass ONLY on Successful Payment
router.post('/verify-payment', verifyPaymentAndRegister);

export default router;
