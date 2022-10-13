import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import CategoryModel from './model'
import { CategoryDocument } from '../../types'
import mongoose from 'mongoose'

export const getCategories: RequestHandler = async (req,res,next) => {
 try {
    const categories = await CategoryModel.find().populate({
        path: 'subCategories',
    select:'_id name'})

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

export const getCategoryById: RequestHandler = async (req,res,next) => {
    try {
        const category = await CategoryModel.findById(req.params.id)

        if(!category) {
            next(createHttpError(404,`Category with id:${req.params.id} does not exist`))
        }

        res.send(category)

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

export const addSubToCategory: RequestHandler = async  (req,res,next) => {
    try {
         const category = await CategoryModel.findById(req.params.id)

         const subs = req.body.subCategories

         if(!category) next(createHttpError(404,`category with id:${req.params.id} not found`))

        const newSubCategories = category?.subCategories.concat(subs)

        const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id,{subCategories: newSubCategories},{new:true})

         res.send(updatedCategory)
              
    } catch (error) {
         next(error)
    } 

}


export const removeSubCategory: RequestHandler = async  (req,res,next) => {
    try {
         const category = await CategoryModel.findById(req.params.id)

         const subToRemove = req.body.remove

         if(!category) next(createHttpError(404,`category with id:${req.params.id} not found`))

         const newSubCategories = category?.subCategories.filter( (subId) => subId !== subToRemove )

         console.log(newSubCategories)

         const newCategory =  await CategoryModel.findByIdAndUpdate(req.params.id,{subCategories: newSubCategories},{new:true})

         res.send(newCategory)
              
    } catch (error) {
         next(error)
    } 

}

