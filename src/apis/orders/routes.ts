import express from 'express'
import { getAllOrders, getOrdersById, getOrdersForUser, updateOrderStatus } from '.'
import { adminMiddleware } from '../../lib/adminMiddleware'
import { JWTAuthMiddleware } from '../../lib/JWTMiddleware'

const orderRouter = express.Router()

orderRouter.get("/me", JWTAuthMiddleware, getOrdersForUser)

orderRouter.get('/',  getAllOrders)

orderRouter.get('/user/:id',  getOrdersById)

orderRouter.patch('/:id',  updateOrderStatus)

export default orderRouter;