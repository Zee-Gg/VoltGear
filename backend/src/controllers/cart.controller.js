import * as cartService from '../services/cart.service.js'
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id)

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, variantId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    const cartItem = await cartService.addToCart(req.user.id, {
      productId,
      quantity,
      variantId
    })

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      })
    }

    const cartItem = await cartService.updateCartItem(
      req.user.id,
      req.params.itemId,
      quantity
    )

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cartItem
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromCart = async (req, res, next) => {
  try {
    await cartService.removeFromCart(req.user.id, req.params.itemId)

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    })
  } catch (error) {
    next(error)
  }
}

export const mergeGuestCart = async (req, res, next) => {
  try {
    const { items } = req.body

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      })
    }

    const cart = await cartService.mergeGuestCart(req.user.id, items)

    res.status(200).json({
      success: true,
      message: 'Guest cart merged',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}