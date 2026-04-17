import { Router } from 'express'
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// All routes require login
router.use(protect)

// Customer routes
router.post('/', createOrder)
router.get('/my-orders', getUserOrders)
router.patch('/:id/cancel', cancelOrder)
router.get('/:id', getOrderById)

// Admin routes
router.get('/admin/all', adminOnly, getAllOrders)
router.patch('/admin/:id/status', adminOnly, updateOrderStatus)

export default router