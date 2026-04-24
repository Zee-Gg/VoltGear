import Stripe from 'stripe'
import prisma from '../lib/prisma.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createPaymentIntent = async (userId, orderId) => {
  // Get the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.userId !== userId) {
    throw new Error('Not authorized to pay for this order')
  }

  if (order.paymentStatus === 'PAID') {
    throw new Error('Order is already paid')
  }

  // Create payment intent with Stripe
  // Amount must be in cents — multiply by 100
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency: 'usd',
    metadata: {
      orderId: order.id,
      userId
    }
  })

  // Save payment intent ID to order
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentIntentId: paymentIntent.id }
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  }
}

export const handleWebhook = async (payload, signature) => {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`)
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object
      const orderId = paymentIntent.metadata.orderId

      // Update order to paid
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING'
        }
      })

      console.log(`Payment succeeded for order ${orderId}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object
      const orderId = paymentIntent.metadata.orderId

      console.log(`Payment failed for order ${orderId}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}