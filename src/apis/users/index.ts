import express from "express"
import mongoose from "mongoose"
import createHttpError from "http-errors"
import { createAccessToken} from "../../lib/tokens"
import { RequestHandler } from "express"
import { IUserRequest } from "../../lib/JWTMiddleware"
import UserModel from "./model"


export const registerUser: RequestHandler = async (req,res,next) => {

    try {
        
    const user = new UserModel(req.body)

    const {_id} =await user.save()

    res.status(201).send({_id})

    } catch(error) {

        next(error)
    }
}

export const loginUser: RequestHandler = async (req,res,next) => {

   try {

    const {email,password} = req.body
     
    const user = await UserModel.checkCredentials(email,password)

    if(!user) {

        next(createHttpError(401, "Incorrent combination of credentials"))
    } else {

        const token = await createAccessToken({_id: user._id, role: user.role})

        res.send({accessToken: token})
    }
    
   } catch (error) {
     console.log(error)
     next(error)
   }
}

export const getUsers: RequestHandler = async (req,res,next) => {

    try {
        
    const users = await UserModel.find()

    res.send(users)

    } catch(error) {

        next(error)
    }
}

export const getMe: RequestHandler = async (req: IUserRequest,res,next) => {

    try {
        
    const user = await UserModel.findById(req.user?._id)

    if(!user) {
        next(createHttpError(404,`author with id: ${req.user?._id} was not found`))
    }

    res.send(user)

    } catch(error) {

        next(error)
    }
}

export const updateUser: RequestHandler = async  (req: IUserRequest,res,next) => {
    try {
         const updatedUser = await UserModel.findByIdAndUpdate(req.user?._id, req.body, {runValidators:true, new:true})

         if(!updatedUser) next(createHttpError(404,`user with id:${req.user?._id} not found`))

         else {
             res.send(updatedUser)
              }
    } catch (error) {
         next(error)
    } 

}