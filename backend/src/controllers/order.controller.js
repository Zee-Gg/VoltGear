import * as orderService from '../services/order.service.js'

export const createOrder = async (req, res, next) => {
  try {
    const { addressId, couponCode } = req.body

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      })
    }

    const order = await orderService.createOrder(req.user.id, {
      addressId,
      couponCode
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id)

    res.status(200).json({
      success: true,
      data: orders
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id
    )

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(
      req.params.id,
      req.user.id
    )

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query)

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const validStatuses = [
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED'
    ]

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      })
    }

    const order = await orderService.updateOrderStatus(
      req.params.id,
      status
    )

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    })
  } catch (error) {
    next(error)
  }
}