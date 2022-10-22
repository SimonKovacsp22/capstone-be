import express from 'express'
import {createProduct, getProductById, getProductsByCategory, updateProduct, deleteProduct, addImage, searchProduct} from './index'
import { cloudinaryUploader } from '../../lib/fileUpload'

const productRouter = express.Router()


productRouter.post("/", createProduct)

productRouter.get("/:id", getProductById)

productRouter.get("/category/:categoryId", getProductsByCategory)

productRouter.put("/:id", updateProduct)

productRouter.delete("/:id", deleteProduct)

productRouter.post("/:id/image" , cloudinaryUploader, addImage)

productRouter.get("/search", searchProduct)

export default productRouter