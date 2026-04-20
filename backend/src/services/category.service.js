import prisma from '../lib/prisma.js'

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return categories
}

export const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return category
}

export const createCategory = async ({ name, image }) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const existing = await prisma.category.findUnique({
    where: { slug }
  })

  if (existing) {
    throw new Error('Category already exists')
  }

  const category = await prisma.category.create({
    data: { name, slug, image }
  })

  return category
}

export const updateCategory = async (id, { name, image }) => {
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: name || category.name,
      image: image || category.image
    }
  })

  return updated
}

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } }
    }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  if (category._count.products > 0) {
    throw new Error('Cannot delete category with existing products')
  }

  await prisma.category.delete({ where: { id } })
}