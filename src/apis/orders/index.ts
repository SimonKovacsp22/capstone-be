import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { IUserRequest } from '../../lib/JWTMiddleware'
import OrderModel from './model'

export const getOrdersForUser:RequestHandler =async (req:IUserRequest,res,next) => {
   try{
    const myOrders = await OrderModel.find({user: req.user?._id}).populate({
        path:'products'
    })
    if(myOrders) {
        res.send(myOrders)
    }
}catch(error) {
    next(createHttpError(404))
}
}

export const getAllOrders:RequestHandler = async (req,res,next) => {
    try{
       const {skip,limit,email,startDate,endDate} = req.query
        
       

       if(startDate && endDate && skip && limit && !email){
        
        const startDateFormated = startDate.toString().replaceAll('/','-').concat('T00:00:00.000Z')
        console.log(startDateFormated )
        
        const endDateFormated = endDate.toString()?.replaceAll('/','-').concat('T23:59:59.999Z')
        console.log(endDateFormated)
        
        const total = await OrderModel.countDocuments({createdAt:{$gte:startDateFormated , $lte: endDateFormated}})

        const totalPages = Math.ceil(total / parseInt(limit as string))

        
        
        const orders = await OrderModel.find({createdAt:{$gte:startDateFormated , $lte: endDateFormated}}).limit(parseInt(limit as string)).skip(parseInt(skip as string)).sort({createdAt:-1}).populate({path:'user'}).populate('products')
    
    
    if(orders) {
        res.send({total, totalPages, limit, orders})
    }
      /////////////////////////////////////////////////////////////// 
    } else if (email  && skip && limit && !startDate) {
        const total = await OrderModel.countDocuments({guest:email})

        const totalPages = Math.ceil(total / parseInt(limit as string))

        const orders = await OrderModel.find({guest:email}).limit(parseInt(limit as string)).skip(parseInt(skip as string)).sort({createdAt:-1}).populate({path:'user'}).populate('products')
        
        res.send({total, totalPages, limit, orders})
          ///////////////////////////////////////////////////////
    } else if (startDate && endDate && skip && limit && email){

        const startDateFormated = startDate.toString().replaceAll('/','-')?.concat('T00:00:00.000Z')
        
        const endDateFormated = endDate.toString().replaceAll('/','-')?.concat('T23:59:59.999Z')

        const total = await OrderModel.countDocuments({guest:email,createdAt:{$gte:startDateFormated , $lte: endDateFormated}})

        const totalPages = Math.ceil(total / parseInt(limit as string))

        
        const orders = await OrderModel.find({guest:email,createdAt:{$gte:startDateFormated , $lte: endDateFormated}}).limit(parseInt(limit as string)).skip(parseInt(skip as string)).sort({createdAt:-1}).populate({path:'user'}).populate('products')
    
    
    if(orders) {
        res.send({total, totalPages, limit, orders})
    }
       ////////////////////////////////////////////////////////// 
    } else if (limit && skip) {
        
        const total = await OrderModel.countDocuments()

        const totalPages = Math.ceil(total / parseInt(limit as string))


        const orders = await OrderModel.find().limit(parseInt(limit as string)).skip(parseInt(skip as string)).sort({createdAt:-1}).populate({path:'user'}).populate('products')
     
     
     if(orders) {
         res.send({total, totalPages, limit, orders})
     }
        }
       


     
 }catch(error) {
     next(createHttpError(404))
 }
 }





 export const updateOrderStatus:RequestHandler= async (req,res,next) => {
    try{
     const order = await OrderModel.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true})
     if(order) {
         res.send(order)
     }
 }catch(error) {
     next(createHttpError(404))
 }
 }

 export const getOrdersByDateRange:RequestHandler = async (req,res,next) => {
    try{
    const {startDate,endDate} = req.query
    console.log(req.query.startDate)

    if(startDate && endDate){
        const startDateFormated = startDate.toString()?.concat('T00:00:00.000Z')
        
        const endDateFormated = endDate.toString()?.concat('T23:59:59.999Z')
    
     const orders = await OrderModel.find({createdAt:{$gte:startDateFormated , $lte: endDateFormated}}).sort({createdAt:-1})
     if(orders) {
         res.send(orders)
     }  }
    
    
 }catch(error) {
     next(createHttpError(404))
 }
 }

 export const getOrdersByEmail:RequestHandler = async (req,res,next) => {
    
    try{
        const {email} = req.query
     const orders = await OrderModel.find({guest:email}).sort({createdAt:-1}).populate({path:'user'}).populate('products')
     if(orders) {
         res.send(orders)
     } else {

        next(createHttpError(404))
     }
 }catch(error) {
     next(createHttpError(404))
 }
 }

 export const getOrdersById: RequestHandler = async (req,res,next) => {
    
    try{
        const {id} = req.params
     const orders = await OrderModel.find({user:id}).sort({createdAt:-1}).populate({path:'user'}).populate('products')
     if(orders) {
         res.send(orders)
     } else {

        next(createHttpError(404))
     }
 }catch(error) {
     next(createHttpError(404))
 }
 }