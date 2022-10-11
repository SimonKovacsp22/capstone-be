import express from 'express'
import {getCategories,
    createCategory,
    updateCategory,
    addSubToCategory,
    removeSubCategory} from './index'

const categoryRouter = express.Router()

categoryRouter.get("/", getCategories)

categoryRouter.post("/", createCategory)

categoryRouter.put("/:id", updateCategory)

categoryRouter.put("/add/:id", addSubToCategory)

categoryRouter.delete("/remove/:id", removeSubCategory)

export default categoryRouter