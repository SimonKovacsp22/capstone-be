import express from 'express'
import { addItemToCart, getCartByUser } from '.'

const cartRouter = express.Router()

cartRouter.post('/:userId', addItemToCart)

cartRouter.get('/:userId', getCartByUser)

export default cartRouter