import express from 'express'
import { addItemToCart, getCartByUser,removeItemFromCart } from '.'

const cartRouter = express.Router()

cartRouter.post('/:userId', addItemToCart)

cartRouter.get('/:userId', getCartByUser)

cartRouter.post('/:userId/remove', removeItemFromCart)

export default cartRouter