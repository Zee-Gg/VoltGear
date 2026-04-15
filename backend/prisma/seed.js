import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cables' },
      update: {},
      create: { name: 'Cables', slug: 'cables' }
    }),
    prisma.category.upsert({
      where: { slug: 'chargers' },
      update: {},
      create: { name: 'Chargers', slug: 'chargers' }
    }),
    prisma.category.upsert({
      where: { slug: 'earphones' },
      update: {},
      create: { name: 'Earphones', slug: 'earphones' }
    })
  ])

  console.log('Categories created:', categories.length)

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'usb-c-cable-2m' },
      update: {},
      create: {
        name: 'USB-C Cable 2m',
        slug: 'usb-c-cable-2m',
        description: 'Fast charging USB-C cable, 2 meters long',
        price: 12.99,
        stock: 100,
        images: [],
        brand: 'VoltGear',
        categoryId: categories[0].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '65w-gan-charger' },
      update: {},
      create: {
        name: '65W GaN Charger',
        slug: '65w-gan-charger',
        description: 'Compact 65W GaN fast charger',
        price: 34.99,
        stock: 50,
        images: [],
        brand: 'VoltGear',
        categoryId: categories[1].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'wireless-earbuds-pro' },
      update: {},
      create: {
        name: 'Wireless Earbuds Pro',
        slug: 'wireless-earbuds-pro',
        description: 'Premium wireless earbuds with ANC',
        price: 79.99,
        stock: 30,
        images: [],
        brand: 'VoltGear',
        categoryId: categories[2].id
      }
    })
  ])

  console.log('Products created:', products.length)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())