import * as authService from '../services/auth.service.js'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const user = await authService.registerUser({ name, email, password })

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const { user, accessToken, refreshToken } = await authService.loginUser({
      email,
      password
    })

    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken }
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    const newAccessToken = await authService.refreshAccessToken(refreshToken)

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    await authService.logoutUser(refreshToken)

    res.clearCookie('refreshToken', cookieOptions)

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  })
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body
    const user = await authService.updateUserProfile(req.user.id, { name })

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new passwords are required'
      })
    }

    await authService.updateUserPassword(req.user.id, currentPassword, newPassword)

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    next(error)
  }
}