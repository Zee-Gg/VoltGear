import { Router } from 'express'
import {
  createPaymentIntent,
  handleWebhook
} from '../controllers/payment.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

// Webhook must use raw body — not parsed JSON
// This is why it's defined before express.json() middleware
router.post(
  '/webhook',
  handleWebhook
)

// Protected route to create payment intent
router.post('/create-payment-intent', protect, createPaymentIntent)

export default router