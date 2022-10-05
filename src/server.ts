import express from "express";
import cors from 'cors'
import mongoose from 'mongoose'
import passport from "passport";
import listEndpoints from 'express-list-endpoints'
import { badRequestHandler,
         unauthorizedHandler,
         genericServerErrorHandler,
         notFoundHandler,
         forbiddenErrorHandler  } from './lib/errorHandlers'
import  userRouter  from '../src/apis/users/routes'
import googleStrategy from "./lib/googleLogin";
import categoryRouter from "./apis/categories/routes";
import productRouter from "./apis/products/routes";

const port = process.env.PORT

const server = express()




server.use(cors())
server.use(express.json())

server.use(passport.initialize())

passport.use("google", googleStrategy)

server.use("/users", userRouter)
server.use("/categories", categoryRouter)
server.use("/products", productRouter)


server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

mongoose.connect(process.env.MONGO_CON_URL!)

mongoose.connection.on("connected", () => {
    console.log("success")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("server is listening on port:",port)
    })
})