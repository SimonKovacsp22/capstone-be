import express from "express"
import mongoose from "mongoose"
import createHttpError from "http-errors"
import { createAccessToken, createNewTokens, createTokens} from "../../lib/tokens"
import { RequestHandler } from "express"
import { IUserRequest } from "../../lib/JWTMiddleware"
import UserModel from "./model"
import { findPinInDB, checkIfPinExpired  } from "../pin/index"
import bcrypt from "bcrypt"


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

       const tokens = await createTokens(user)

        res.send({accessToken: tokens?.accessToken, refreshToken: tokens?.refreshToken})
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

export const updateUser: RequestHandler = async (req: IUserRequest,res,next) => {
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

export const updatePassword: RequestHandler = async (req,res,next) => {
    try {
         
        const {email, pin, newPassword} = req.body
       
        const data = await findPinInDB(email,pin)

        const pinCreatedAt = data?.createdAt

        if(pinCreatedAt) {

        const PinhasNotExpired = checkIfPinExpired(pinCreatedAt)

        if(data?.email && PinhasNotExpired) {

        const user = await getUserByEmail(data.email)

        if(user?._id) {

            const hash = await bcrypt.hash(newPassword as string, 10)

            const updatedUser = await UserModel.findByIdAndUpdate(user._id,{password: hash})

            
        }

            
        } else {
            res.send({success: false, message: 'Invalid or expired pin'})
        }

        res.status(201).send()
    }
             
              
    } catch (error) {
         next(error)
    } 

}



export const getUserByEmail = async (email:String) => {
    try {

        const user = await UserModel.findOne({email})

        if(user && user._id) return user

        else {
            return null
        }
        
    } catch (error) {
        console.log(error)
    }
}

export const refreshTokens:RequestHandler = async (req,res,next) => {
    try {

        const refreshToken = req.headers.authorization?.replace("Bearer ", "");

        if(refreshToken){ 
            
            const tokens = await createNewTokens(refreshToken)

            res.send({accessToken: tokens?.accessToken, refreshToken: tokens?.refreshToken})
        }

    } catch (error) {
        next(error)
    }
}