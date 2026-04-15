import { Router } from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart
} from '../controllers/cart.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

// All cart routes require login
router.use(protect)

router.get('/', getCart)
router.post('/', addToCart)
router.patch('/:itemId', updateCartItem)
router.delete('/clear', clearCart)
router.delete('/:itemId', removeFromCart)
router.post('/merge', mergeGuestCart)

export default router