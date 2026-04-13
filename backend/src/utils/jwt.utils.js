import jwt from 'jsonwebtoken'

const getEnvOrThrow = (key) => {
    const value = process.env[key]

    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${key}`)
    }

    return value
}

export const generateAccessToken = (userId , role)=>{
    return jwt.sign(
        {userId , role},
                getEnvOrThrow('JWT_SECRET'),
        {expiresIn:'15m'}

    )
}

export const generateRefreshToken =(userId)=>{
    return jwt.sign(
        {userId},
        getEnvOrThrow('JWT_REFRESH_SECRET'),
        {expiresIn:'7d'}
    )
}

export const verifyAccessToken =(token)=>{
    return jwt.verify(token , getEnvOrThrow('JWT_SECRET'))
}

export const verifyRefreshToken = (token)=>{
    return jwt.verify(token , getEnvOrThrow('JWT_REFRESH_SECRET'))
}