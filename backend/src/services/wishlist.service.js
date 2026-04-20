import prisma from '../lib/prisma.js'

const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId }
  })

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId }
    })
  }

  return wishlist
}

export const getWishlist = async (userId) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: true,
              rating: true,
              stock: true
            }
          }
        }
      }
    }
  })

  if (!wishlist) {
    return { items: [] }
  }

  return wishlist
}

export const addToWishlist = async (userId, productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  const wishlist = await getOrCreateWishlist(userId)

  // Check if already in wishlist
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId
      }
    }
  })

  if (existing) {
    throw new Error('Product already in wishlist')
  }

  const item = await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId
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

  return item
}

export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId }
  })

  if (!wishlist) {
    throw new Error('Wishlist not found')
  }

  const item = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId
      }
    }
  })

  if (!item) {
    throw new Error('Item not found in wishlist')
  }

  await prisma.wishlistItem.delete({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId
      }
    }
  })
}