import { Router } from 'express'
import {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// Public — anyone can validate a coupon during checkout
router.get('/validate/:code', protect, validateCoupon)

// Admin only
router.get('/', protect, adminOnly, getAllCoupons)
router.post('/', protect, adminOnly, createCoupon)
router.patch('/:id', protect, adminOnly, updateCoupon)
router.delete('/:id', protect, adminOnly, deleteCoupon)

export default router