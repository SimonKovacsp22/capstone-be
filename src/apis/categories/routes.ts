import express from 'express'
import {getCategories,
    createCategory,
    updateCategory} from './index'

const categoryRouter = express.Router()

categoryRouter.get("/", getCategories)

categoryRouter.post("/", createCategory)

categoryRouter.put("/:id", updateCategory)

export default categoryRouter