import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true }
    })

    const ordersCount = await prisma.order.count()
    const usersCount = await prisma.user.count()
    const productsCount = await prisma.product.count()

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    })

    const salesByMonth = await prisma.order.groupBy({
      by: ['createdAt'],
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true }
    })

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        ordersCount,
        usersCount,
        productsCount,
        recentOrders,
        salesByMonth
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router
