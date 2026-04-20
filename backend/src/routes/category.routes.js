import { Router } from 'express'
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// Public
router.get('/', getAllCategories)
router.get('/:slug', getCategoryBySlug)

// Admin only
router.post('/', protect, adminOnly, createCategory)
router.patch('/:id', protect, adminOnly, updateCategory)
router.delete('/:id', protect, adminOnly, deleteCategory)

export default router