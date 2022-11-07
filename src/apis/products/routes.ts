import express from 'express'
import {createProduct, getProductById, getProductsByCategory, updateProduct, deleteProduct, addImage, searchProduct,getTopProducts } from './index'
import { cloudinaryUploader } from '../../lib/fileUpload'

const productRouter = express.Router()


productRouter.post("/", createProduct)
productRouter.get("/top", getTopProducts)

productRouter.get("/search", searchProduct)

productRouter.get("/:id", getProductById)

productRouter.get("/category/:categoryId", getProductsByCategory)

productRouter.put("/:id", updateProduct)

productRouter.delete("/:id", deleteProduct)

productRouter.post("/:id/image" , cloudinaryUploader, addImage)



export default productRouter