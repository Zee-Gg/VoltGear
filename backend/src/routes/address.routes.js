import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import prisma from '../lib/prisma.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

router.use(protect)

router.post('/', async (req, res, next) => {
  try {
    const { fullName, phone, street, city, state, postalCode, country } = req.body

    const address = await prisma.address.create({
      data: {
        id: uuidv4(),
        userId: req.user.id,
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: true
      }
    })

    res.status(201).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id }
    })
    res.status(200).json({ success: true, data: addresses })
  } catch (error) {
    next(error)
  }
})

export default router