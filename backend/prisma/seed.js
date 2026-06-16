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
    }),
    prisma.category.upsert({
      where: { slug: 'power-banks' },
      update: {},
      create: { name: 'Power Banks', slug: 'power-banks' }
    }),
    prisma.category.upsert({
      where: { slug: 'screen-protectors' },
      update: {},
      create: { name: 'Screen Protectors', slug: 'screen-protectors' }
    }),
    prisma.category.upsert({
      where: { slug: 'cases' },
      update: {},
      create: { name: 'Cases', slug: 'cases' }
    })
  ])

  console.log('Categories created:', categories.length)

  // Create products
  const products = await Promise.all([
    // Cables (Category 0)
    prisma.product.upsert({
      where: { slug: 'usb-c-cable-2m' },
      update: {
        images: ['https://images.unsplash.com/photo-1614008375890-cb72e14c0fa3?w=500&h=500&fit=crop']
      },
      create: {
        name: 'USB-C Cable 2m',
        slug: 'usb-c-cable-2m',
        description: 'Fast charging USB-C cable, 2 meters long',
        price: 12.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1614008375890-cb72e14c0fa3?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[0].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'lightning-cable-1m' },
      update: {
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Lightning Cable 1m',
        slug: 'lightning-cable-1m',
        description: 'Certified Lightning cable for iPhones and iPads',
        price: 9.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[0].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'micro-usb-cable-3m' },
      update: {
        images: ['https://images.unsplash.com/photo-1651032069067-e79ebe4c4e72?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Micro USB Cable 3m',
        slug: 'micro-usb-cable-3m',
        description: 'Durable micro USB cable, 3 meters long',
        price: 7.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1651032069067-e79ebe4c4e72?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[0].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'braided-usb-c-cable' },
      update: {
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Braided USB-C Cable',
        slug: 'braided-usb-c-cable',
        description: 'Premium braided USB-C cable with reinforced connectors',
        price: 15.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[0].id
      }
    }),

    // Chargers (Category 1)
    prisma.product.upsert({
      where: { slug: '65w-gan-charger' },
      update: {
        images: ['https://images.unsplash.com/photo-1609042231372-c7d30dbf1d95?w=500&h=500&fit=crop']
      },
      create: {
        name: '65W GaN Charger',
        slug: '65w-gan-charger',
        description: 'Compact 65W GaN fast charger',
        price: 34.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1609042231372-c7d30dbf1d95?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[1].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '30w-pd-charger' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: '30W PD Charger',
        slug: '30w-pd-charger',
        description: 'Fast 30W Power Delivery charger',
        price: 19.99,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[1].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '100w-multi-port-charger' },
      update: {
        images: ['https://images.unsplash.com/photo-1644074284401-8c7af8046b3d?w=500&h=500&fit=crop']
      },
      create: {
        name: '100W Multi-Port Charger',
        slug: '100w-multi-port-charger',
        description: 'Powerful 100W charger with 4 ports',
        price: 49.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1644074284401-8c7af8046b3d?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[1].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '20w-iphone-charger' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: '20W iPhone Charger',
        slug: '20w-iphone-charger',
        description: 'Official 20W charger for iPhone 12 and later',
        price: 24.99,
        stock: 90,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[1].id
      }
    }),

    // Earphones (Category 2)
    prisma.product.upsert({
      where: { slug: 'wireless-earbuds-pro' },
      update: {
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Wireless Earbuds Pro',
        slug: 'wireless-earbuds-pro',
        description: 'Premium wireless earbuds with ANC',
        price: 79.99,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[2].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'sport-wireless-earbuds' },
      update: {
        images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Sport Wireless Earbuds',
        slug: 'sport-wireless-earbuds',
        description: 'Water-resistant earbuds designed for sports',
        price: 49.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[2].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'noise-cancelling-earbuds' },
      update: {
        images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Noise Cancelling Earbuds',
        slug: 'noise-cancelling-earbuds',
        description: 'Active noise cancelling with 30-hour battery',
        price: 99.99,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[2].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'budget-earbuds' },
      update: {
        images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Budget Earbuds',
        slug: 'budget-earbuds',
        description: 'Affordable wireless earbuds with great sound',
        price: 29.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[2].id
      }
    }),

    // Power Banks (Category 3)
    prisma.product.upsert({
      where: { slug: '20000mah-power-bank' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: '20000mAh Power Bank',
        slug: '20000mah-power-bank',
        description: 'High capacity power bank with fast charging',
        price: 39.99,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[3].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '10000mah-compact-power-bank' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: '10000mAh Compact Power Bank',
        slug: '10000mah-compact-power-bank',
        description: 'Lightweight and portable power bank',
        price: 19.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[3].id
      }
    }),
    prisma.product.upsert({
      where: { slug: '30000mah-mega-power-bank' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: '30000mAh Mega Power Bank',
        slug: '30000mah-mega-power-bank',
        description: 'Ultimate power bank with 4 ports',
        price: 59.99,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[3].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'solar-power-bank' },
      update: {
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Solar Power Bank',
        slug: 'solar-power-bank',
        description: 'Eco-friendly solar charging power bank',
        price: 44.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1609043152867-d716b720c563?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[3].id
      }
    }),

    // Screen Protectors (Category 4)
    prisma.product.upsert({
      where: { slug: 'tempered-glass-iphone-14' },
      update: {
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Tempered Glass iPhone 14',
        slug: 'tempered-glass-iphone-14',
        description: '9H hardness tempered glass screen protector',
        price: 9.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[4].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'privacy-screen-protector' },
      update: {
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Privacy Screen Protector',
        slug: 'privacy-screen-protector',
        description: 'Privacy filter screen protector for 6.5 inch phones',
        price: 14.99,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[4].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'blue-light-screen-protector' },
      update: {
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Blue Light Screen Protector',
        slug: 'blue-light-screen-protector',
        description: 'Reduces blue light to protect your eyes',
        price: 11.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1572532713456-9cf6ce175a3f?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[4].id
      }
    }),

    // Cases (Category 5)
    prisma.product.upsert({
      where: { slug: 'leather-phone-case' },
      update: {
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Leather Phone Case',
        slug: 'leather-phone-case',
        description: 'Premium leather protective phone case',
        price: 24.99,
        stock: 70,
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[5].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'rugged-shockproof-case' },
      update: {
        images: ['https://images.unsplash.com/photo-1619994636290-dabd421f2d8a?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Rugged Shockproof Case',
        slug: 'rugged-shockproof-case',
        description: 'Military-grade shockproof protection',
        price: 19.99,
        stock: 85,
        images: ['https://images.unsplash.com/photo-1619994636290-dabd421f2d8a?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[5].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'clear-tpu-case' },
      update: {
        images: ['https://images.unsplash.com/photo-1573117446155-5845f3700df4?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Clear TPU Case',
        slug: 'clear-tpu-case',
        description: 'Transparent TPU case to show off your phone',
        price: 14.99,
        stock: 110,
        images: ['https://images.unsplash.com/photo-1573117446155-5845f3700df4?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[5].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'flip-wallet-case' },
      update: {
        images: ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop']
      },
      create: {
        name: 'Flip Wallet Case',
        slug: 'flip-wallet-case',
        description: 'Flip case with card slots and wallet',
        price: 29.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop'],
        brand: 'VoltGear',
        categoryId: categories[5].id
      }
    })
  ])

  console.log('Products created:', products.length)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())