import prisma from '../lib/prisma.js'

const getOrCreateCart = async(userId)=>{
    let cart = await prisma.cart.findUnique({
        where:{userId}
    })
    if(!cart){
        cart= await prisma.cart.create({
            data:{userId}
        })
    }
    return cart
}

export const getCart = async(userId)=>{
    const cart = await prisma.cart.findUnique({
        where:{userId},
        include:{
            items:{
                include:{
                    product:{
                        select:{
                            id: true,
                            name: true,
                            slug: true,
                            price: true,
                            images: true,
                            stock: true,
                            isActive: true
                        }
                    }
                }
            }

        }
    })
     if (!cart) {
    return { items: [], total: 0, itemCount: 0 }
  }

  // Calculate total in JavaScript
  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  const itemCount = cart.items.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)

  return {
    id: cart.id,
    items: cart.items,
    total: parseFloat(total.toFixed(2)),
    itemCount
  }
}
    export const addToCart = async (userId, { productId, quantity = 1, variantId }) => {
  // Validate product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product || !product.isActive) {
    throw new Error('Product not found')
  }

  if (product.stock < quantity) {
    throw new Error('Not enough stock available')
  }

  const cart = await getOrCreateCart(userId)

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  })

  if (existingItem) {
    // Update quantity instead of creating new row
    const newQuantity = existingItem.quantity + quantity

    if (product.stock < newQuantity) {
      throw new Error('Not enough stock available')
    }

    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        }
      }
    })

    return updated
  }

  // Create new cart item
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      variantId: variantId || null
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true
        }
      }
    }
  })

  return cartItem
}

export const updateCartItem = async (userId, itemId, quantity) => {
  // Make sure the item belongs to this user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) {
    throw new Error('Cart not found')
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true }
  })

  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new Error('Cart item not found')
  }

  if (cartItem.product.stock < quantity) {
    throw new Error('Not enough stock available')
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true
        }
      }
    }
  })

  return updated
}

export const removeFromCart = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) {
    throw new Error('Cart not found')
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId }
  })

  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new Error('Cart item not found')
  }

  await prisma.cartItem.delete({ where: { id: itemId } })
}

export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) return

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  })
}

export const mergeGuestCart = async (userId, guestItems) => {
  for (const item of guestItems) {
    try {
      await addToCart(userId, {
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId
      })
    } catch (error) {
      // Skip items that fail (out of stock, deleted products)
      console.log(`Skipped item ${item.productId}: ${error.message}`)
    }
  }

  return getCart(userId)
}