import * as reviewService from '../services/review.service.js'

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating and comment are required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const review = await reviewService.createReview(req.user.id, {
      productId,
      rating,
      comment
    })

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    })
  } catch (error) {
    next(error)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body

    const review = await reviewService.updateReview(
      req.user.id,
      req.params.id,
      { rating, comment }
    )

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    })
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(
      req.user.id,
      req.params.id,
      req.user.role
    )

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId)

    res.status(200).json({
      success: true,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}