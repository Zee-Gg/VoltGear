import prisma from '../lib/prisma.js'

export const createOrder = async (userId, { addressId, couponCode }) => {
  // Get user's cart with all items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Validate address belongs to user
  const address = await prisma.address.findUnique({
    where: { id: addressId }
  })

  if (!address || address.userId !== userId) {
    throw new Error('Invalid address')
  }

  // Validate stock for all items before doing anything
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${item.product.name}`)
    }
  }

  // Handle coupon
  let discount = 0
  let validCoupon = null

  if (couponCode) {
    validCoupon = await prisma.coupon.findUnique({
      where: { code: couponCode }
    })

    if (
      !validCoupon ||
      !validCoupon.isActive ||
      validCoupon.expiresAt < new Date() ||
      validCoupon.usedCount >= validCoupon.maxUses
    ) {
      throw new Error('Invalid or expired coupon')
    }
  }

  // Calculate total
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  if (validCoupon) {
    discount = parseFloat(
      ((subtotal * validCoupon.discountPercent) / 100).toFixed(2)
    )
  }

  const totalAmount = parseFloat((subtotal - discount).toFixed(2))

  // Database transaction — all or nothing
  const order = await prisma.$transaction(async (tx) => {
    // 1. Create the order
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        discount,
        couponCode: couponCode || null,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            // Snapshot — price, name, image frozen at purchase time
            price: item.product.price,
            name: item.product.name,
            image: item.product.images[0] || ''
          }))
        }
      },
      include: {
        items: true,
        address: true
      }
    })

    // 2. Reduce stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // 3. Update coupon usage
    if (validCoupon) {
      await tx.coupon.update({
        where: { id: validCoupon.id },
        data: { usedCount: { increment: 1 } }
      })
    }

    // 4. Clear the cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    return newOrder
  })

  return order
}

export const getUserOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return orders
}

export const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      address: true
    }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  // Make sure the order belongs to this user
  if (order.userId !== userId) {
    throw new Error('Not authorized to view this order')
  }

  return order
}

export const cancelOrder = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.userId !== userId) {
    throw new Error('Not authorized to cancel this order')
  }

  // Can only cancel pending orders
  if (order.status !== 'PENDING') {
    throw new Error('Only pending orders can be cancelled')
  }

  // Transaction — cancel order and restore stock
  const cancelled = await prisma.$transaction(async (tx) => {
    // 1. Update order status
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    })

    // 2. Restore stock for each item
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity }
        }
      })
    }

    return updated
  })

  return cancelled
}

export const getAllOrders = async (query) => {
  const { page = 1, limit = 20, status } = query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        items: true,
        address: true,
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count({ where })
  ])

  return {
    orders,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  }
}

export const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })

  return updated
}