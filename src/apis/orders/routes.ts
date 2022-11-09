import express from 'express'
import { getAllOrders, getOrdersById, getOrdersForUser, updateOrderStatus } from '.'
import { adminMiddleware } from '../../lib/adminMiddleware'
import { JWTAuthMiddleware } from '../../lib/JWTMiddleware'

const orderRouter = express.Router()

orderRouter.get("/me", JWTAuthMiddleware, getOrdersForUser)

orderRouter.get('/', JWTAuthMiddleware, adminMiddleware, getAllOrders)

orderRouter.get('/user/:id', JWTAuthMiddleware, adminMiddleware, getOrdersById)

orderRouter.patch('/:id', JWTAuthMiddleware, adminMiddleware, updateOrderStatus)

export default orderRouter;