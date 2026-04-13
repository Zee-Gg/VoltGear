import { Router } from 'express'
import authRoutes from './auth.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API v1 healthy' })
})

router.use('/auth', authRoutes)

export default router