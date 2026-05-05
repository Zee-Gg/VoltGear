import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// Get all users
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
})

// Update user role
router.patch('/:id/role', protect, adminOnly, async (req, res, next) => {
  try {
    const { role } = req.body
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, role: true }
    })
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
})

// Delete user
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.status(200).json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
