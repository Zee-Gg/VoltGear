import prisma from '../lib/prisma.js'

export const createCoupon = async ({
  code,
  discountPercent,
  maxUses,
  expiresAt
}) => {
  const existing = await prisma.coupon.findUnique({
    where: { code }
  })

  if (existing) {
    throw new Error('Coupon code already exists')
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountPercent,
      maxUses,
      expiresAt: new Date(expiresAt)
    }
  })

  return coupon
}

export const validateCoupon = async (code) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() }
  })

  if (!coupon) {
    throw new Error('Invalid coupon code')
  }

  if (!coupon.isActive) {
    throw new Error('This coupon is no longer active')
  }

  if (coupon.expiresAt < new Date()) {
    throw new Error('This coupon has expired')
  }

  if (coupon.usedCount >= coupon.maxUses) {
    throw new Error('This coupon has reached its usage limit')
  }

  return {
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    message: `${coupon.discountPercent}% discount applied`
  }
}

export const getAllCoupons = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return coupons
}

export const updateCoupon = async (id, data) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } })

  if (!coupon) {
    throw new Error('Coupon not found')
  }

  const updated = await prisma.coupon.update({
    where: { id },
    data
  })

  return updated
}

export const deleteCoupon = async (id) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } })

  if (!coupon) {
    throw new Error('Coupon not found')
  }

  await prisma.coupon.delete({ where: { id } })
}