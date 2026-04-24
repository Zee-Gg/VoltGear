import * as paymentService from '../services/payment.service.js'

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      })
    }

    const result = await paymentService.createPaymentIntent(
      req.user.id,
      orderId
    )

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature']

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'No stripe signature found'
      })
    }

    // req.body must be raw buffer for webhook verification
    const result = await paymentService.handleWebhook(req.body, signature)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}