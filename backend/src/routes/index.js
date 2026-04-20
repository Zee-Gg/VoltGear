import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import orderRoutes from './order.routes.js'
import reviewRoutes from './review.routes.js'
import wishlistRoutes from './wishlist.routes.js'
import addressRoutes from './address.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API v1 healthy' })
})

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/addresses', addressRoutes)


export default router