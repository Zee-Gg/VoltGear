import prisma from '../lib/prisma.js'

export const createReview = async (userId, { productId, rating, comment }) => {
  // Check user has purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
        }
      }
    }
  })

  if (!hasPurchased) {
    throw new Error('You can only review products you have purchased')
  }

  // Check user hasn't already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  })

  if (existingReview) {
    throw new Error('You have already reviewed this product')
  }

  // Transaction — create review and update product rating together
  const review = await prisma.$transaction(async (tx) => {
    // 1. Create the review
    const newReview = await tx.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    // 2. Recalculate product rating
    const allReviews = await tx.review.findMany({
      where: { productId },
      select: { rating: true }
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    // 3. Update product rating and numReviews
    await tx.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: allReviews.length
      }
    })

    return newReview
  })

  return review
}

export const updateReview = async (userId, reviewId, { rating, comment }) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  })

  if (!review) {
    throw new Error('Review not found')
  }

  if (review.userId !== userId) {
    throw new Error('Not authorized to update this review')
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: { rating, comment },
      include: {
        user: { select: { name: true } }
      }
    })

    // Recalculate rating
    const allReviews = await tx.review.findMany({
      where: { productId: review.productId },
      select: { rating: true }
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await tx.product.update({
      where: { id: review.productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: allReviews.length
      }
    })

    return updatedReview
  })

  return updated
}

export const deleteReview = async (userId, reviewId, userRole) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  })

  if (!review) {
    throw new Error('Review not found')
  }

  // Allow admin or the review owner to delete
  if (review.userId !== userId && userRole !== 'ADMIN') {
    throw new Error('Not authorized to delete this review')
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } })

    // Recalculate rating after deletion
    const allReviews = await tx.review.findMany({
      where: { productId: review.productId },
      select: { rating: true }
    })

    await tx.product.update({
      where: { id: review.productId },
      data: {
        rating:
          allReviews.length > 0
            ? parseFloat(
                (
                  allReviews.reduce((sum, r) => sum + r.rating, 0) /
                  allReviews.length
                ).toFixed(1)
              )
            : 0,
        numReviews: allReviews.length
      }
    })
  })
}

export const getProductReviews = async (productId) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return reviews
}