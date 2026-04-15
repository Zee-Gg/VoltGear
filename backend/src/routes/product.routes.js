import { Router } from 'express'
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} from '../controllers/product.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:slug', getProductBySlug)
router.get('/:slug/related', getRelatedProducts)

// Admin only routes
router.post('/', protect, adminOnly, createProduct)
router.patch('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router