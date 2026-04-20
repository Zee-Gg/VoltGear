import * as categoryService from '../services/category.service.js'
export const getAllCategories = async(req, res, next)=>{
    try{
        const categories = await categoryService.getAllCategories()
        res.status(200).json({
            success:true,
            data: categories 
        })
    }
    catch(error){
        next(error)
    }
}

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug)

    res.status(200).json({
      success: true,
      data: category
    })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }

    const category = await categoryService.createCategory({ name, image })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    )

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}