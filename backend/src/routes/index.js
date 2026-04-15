import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API v1 healthy' })
})

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)

export default router