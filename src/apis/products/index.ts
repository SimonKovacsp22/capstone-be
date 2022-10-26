import { RequestHandler } from "express"
import createHttpError from "http-errors"
import ProductModel from "./model"
import mongoose from "mongoose"
import { Category } from "../../types"

export const createProduct: RequestHandler = async (req,res,next) => {
    try {
         const newProduct = new ProductModel(req.body)

         const {_id} = await newProduct.save()

         res.send({_id})

    } catch (error) {
        next(error)
    }
}
export const getProductById: RequestHandler = async (req,res,next) => {
    try {

        const product = await ProductModel.findById(req.params.id)
        
        if(!product) next(createHttpError(404,`product with id:${req.params.id} not found`))

        else {
            res.send(product)
        }
        
    } catch (error) {
        next(error)
    }
}
export const getProductsByCategory: RequestHandler = async (req,res,next) => {
    try {
        
       
        const products = await ProductModel.find().populate({path:'categories'})

       const productsInCategory =  products.filter( product => product.categories.some((category:any)=> category._id.toString() === req.params.categoryId))

        res.send(productsInCategory)
        
    } catch (error) {
        next(error)
    }
}
export const updateProduct: RequestHandler = async (req,res,next) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        
        if(!updatedProduct) next(createHttpError(404,`product with id:${req.params.id} not found`))

        else {
            res.send(updatedProduct)
        }


    } catch (error) {
        next(error)
    }
}
export const deleteProduct: RequestHandler = async (req,res,next) => {
    try {

        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)

        if(!deletedProduct) next(createHttpError(404,`product with id:${req.params.id} not found`))

        else {
            res.status(204).send()
        }


        
    } catch (error) {
        next(error)
    }
}

export const addImage: RequestHandler = async (req, res, next) => {
    try {

      const product = await ProductModel.findByIdAndUpdate(req.params.id, { image_path: req.file?.path }, { new: true, runValidators: true })
  
      if (!product) {
        next(createHttpError(404, `product with id: ${req.params.id} not found`))
      }
  
      res.send(product)
    } catch (error) {
      next(error)
    }
  };


  export const searchProduct: RequestHandler  = async (req, res, next) => {
    try {

      const products = await ProductModel.find()


      if(req.query.term?.length) {
        if(req.query.term?.length < 3){

            res.send({message:"Please input a longer search term."})
        } else {
            const searchedProducts = products.filter( (prod => prod.name.toLocaleLowerCase().includes((req.query.term?.toString() as string).toLocaleLowerCase())))
            res.send(searchedProducts)
        }
     
   


   
    } else {
        res.send(products)
    }


      

      
  
    
    } catch (error) {
      next(error)
    }
  };