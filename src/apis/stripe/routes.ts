import express from "express";
import {createSession} from './index'

const stripeRouter = express.Router()


stripeRouter.post('/create-checkout-session', createSession)


export default stripeRouter;