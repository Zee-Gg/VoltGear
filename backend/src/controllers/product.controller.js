import * as productService from '../services/product.service.js'
export const getAllProducts = async(req, res, next)=>{
    try{
        const result= await productService.getAllProducts(req.query)
        res.status(200).json({
            success:true,
            data:result.products,
            pagination:result.pagination
        })
    }
    catch(error){
        next(error)
    }
}

export const getProductBySlug= async(req, res, next)=>{
    try{
        const product= await productService.getProductBySlug(req.params.slug)
        res.status(200).json({
            success:true,
            data:product
        })

    }
    catch(error){
        next(error)
    }
}

export const createProduct= async(req, res, next)=>{
    try{
        const product = await productService.createProduct(req.body)
        res.status(201).json({
            success:true,
            message:'Product created successfully',
            data:product
        })
    }
    catch(error){
        next(error)
    }

}

export const updateProduct= async(req,res, next)=>{
    try{
        const product= await productService.updateProduct(req.params.id , req.body)
        res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug)
    const related = await productService.getRelatedProducts(
      product.categoryId,
      product.id
    )

    res.status(200).json({
      success: true,
      data: related
    })
  } catch (error) {
    next(error)
  }
}
    