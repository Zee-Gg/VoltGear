import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.utils.js'

export const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Save user to database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

export const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Compare password with hash
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role)
  const refreshToken = generateRefreshToken(user.id)

  // Save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  }
}

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token provided')
  }

  // Verify the token is valid
  const payload = verifyRefreshToken(refreshToken)

  // Check it exists in database (not revoked)
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  })

  if (!storedToken) {
    throw new Error('Invalid refresh token')
  }

  // Check it hasn't expired
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    throw new Error('Refresh token expired')
  }

  // Generate new access token
  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  })

  const newAccessToken = generateAccessToken(user.id, user.role)

  return newAccessToken
}

export const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })
  }
}