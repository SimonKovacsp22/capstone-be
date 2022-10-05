import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import CategoryModel from './model'

export const getCategories: RequestHandler = async (req,res,next) => {
 try {
    const categories = await CategoryModel.find()

    res.send(categories)
 } catch (error) {
    next(error)
 } 




}
export const createCategory: RequestHandler = async (req,res,next) => {
    try {
        const newCategory = new CategoryModel(req.body)

        const {_id} = await newCategory.save()

        res.status(201).send({_id})

    } catch (error) {
        next(error)
    }
    

}
export const updateCategory: RequestHandler = async  (req,res,next) => {
       try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {runValidators:true, new:true})

            if(!updatedCategory) next(createHttpError(404,`category with id:${req.params.id} not found`))

            else {
                res.send(updatedCategory)
                 }
       } catch (error) {
            next(error)
       } 
   
}