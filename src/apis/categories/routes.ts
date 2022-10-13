import express from 'express'
import {getCategories,
    createCategory,
    updateCategory,
    addSubToCategory,
    removeSubCategory, getCategoryById} from './index'

const categoryRouter = express.Router()

categoryRouter.get("/", getCategories)

categoryRouter.get("/:id", getCategoryById)

categoryRouter.post("/", createCategory)

categoryRouter.put("/:id", updateCategory)

categoryRouter.post("/add/:id", addSubToCategory)

categoryRouter.delete("/remove/:id", removeSubCategory)

export default categoryRouter