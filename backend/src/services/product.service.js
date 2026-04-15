
export const getAllProducts = async(query)=>{
    const{
        page=1,
        limit=12,
        search,
        category,
        minPrice,
        maxPrice,
        brand,
        order='createdAt',
        sort='desc'
    }=query

    const pageNumber = parseInt(page)
    const limitNumber= parseInt(limit)
    const skip = (pageNumber -1)*limitNumber

    // Build filers dynamically

    const where={
        isActive:true
    }

    if(search){
        where.name={
            contains:'search',
            mode:'insensitive'
        }
    }

    if(category){
        where.category={
            slug:category
        }
    }

    if (brand) {
    where.brand = {
      equals: brand,
      mode: 'insensitive'
    }
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }
// Build sort
const validSortFields =['price', 'createdAt', 'rating', 'numReviews']
const sortField = validSortFields.includes(sort)? sort:'createdAt'
const sortOrder = order === 'asc' ? 'asc' : 'desc'
const orderBy = { [sortField]: sortOrder }

// Run both queries at the same time
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        brand: true,
        rating: true,
        numReviews: true,
        stock: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    }),
    prisma.product.count({ where })
  ])

  return {
    products,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    }
  }
}

export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true }
      },
      variants: true,
      reviews: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  return product
}

export const createProduct = async (data) => {
  const {
    name,
    description,
    price,
    stock,
    images,
    brand,
    categoryId,
    variants
  } = data

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Check slug is unique
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    throw new Error('A product with this name already exists')
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: images || [],
      brand,
      categoryId,
      variants: variants
        ? {
            create: variants
          }
        : undefined
    },
    include: {
      category: true,
      variants: true
    }
  })

  return product
}

export const updateProduct = async (id, data) => {
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    throw new Error('Product not found')
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      price: data.price ? parseFloat(data.price) : undefined,
      stock: data.stock ? parseInt(data.stock) : undefined
    },
    include: {
      category: true,
      variants: true
    }
  })

  return updated
}

export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    throw new Error('Product not found')
  }

  await prisma.product.delete({ where: { id } })
}

export const getRelatedProducts = async (categoryId, excludeId) => {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      isActive: true
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      rating: true
    }
  })

  return products
}
