import * as wishlistService from '../services/wishlist.service.js'

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id)

    res.status(200).json({
      success: true,
      data: wishlist
    })
  } catch (error) {
    next(error)
  }
}

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    const item = await wishlistService.addToWishlist(req.user.id, productId)

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      data: item
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromWishlist = async (req, res, next) => {
  try {
    await wishlistService.removeFromWishlist(req.user.id, req.params.productId)

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist'
    })
  } catch (error) {
    next(error)
  }
}