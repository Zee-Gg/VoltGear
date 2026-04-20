import * as couponService from '../services/coupon.service.js'

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, maxUses, expiresAt } = req.body

    if (!code || !discountPercent || !maxUses || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Code, discountPercent, maxUses and expiresAt are required'
      })
    }

    const coupon = await couponService.createCoupon({
      code,
      discountPercent,
      maxUses,
      expiresAt
    })

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params

    const result = await couponService.validateCoupon(code)

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons()

    res.status(200).json({
      success: true,
      data: coupons
    })
  } catch (error) {
    next(error)
  }
}

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCoupon = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}