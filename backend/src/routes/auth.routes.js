import { Router } from 'express'
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  updatePassword
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.patch('/update-profile', protect, updateProfile)
router.patch('/update-password', protect, updatePassword)

export default router