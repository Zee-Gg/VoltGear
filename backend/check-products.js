import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: { name: true, images: true }
  })
  
  console.log('\nProduct Image Status:')
  console.log('====================\n')
  
  let withImages = 0
  let withoutImages = 0
  
  products.forEach(product => {
    const hasImages = product.images && product.images.length > 0
    if (hasImages) withImages++
    else withoutImages++
    
    const status = hasImages ? '✓' : '✗'
    console.log(`${status} ${product.name} - ${product.images?.length || 0} images`)
  })
  
  console.log(`\nTotal: ${products.length}`)
  console.log(`With images: ${withImages}`)
  console.log(`Without images: ${withoutImages}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
