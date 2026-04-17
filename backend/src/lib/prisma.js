import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

// import { config } from 'dotenv'
// config({ path: new URL('../../.env', import.meta.url).pathname })

// import pkg from '@prisma/client'
// const { PrismaClient } = pkg

// const globalForPrisma = globalThis

// const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }

// export default prisma