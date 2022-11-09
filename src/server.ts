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
import pinRouter from "./apis/pin/routes";
import cartRouter from "./apis/cart/routes"
import stripeRouter from "./apis/stripe/routes"
import { webhooks } from "./apis/stripe";
import createHttpError from "http-errors";
import messageRouter from "./apis/message/routes";
import chatRouter from "./apis/chat/routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { newConnectionHandler } from "./socket/socket";
import orderRouter from "./apis/orders/routes";



const port = process.env.PORT

const server = express()
const httpServer = createServer(server);


server.use(
  cors({
    origin: (origin, corsNext) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            "Cors Error! Your origin " + origin + "is not in the list"
          )
        );
      }
    },
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.DOMAIN,
  }
});

newConnectionHandler(io)


const whitelist = [ process.env.DOMAIN]

server.use(express.json())

server.use(passport.initialize())

passport.use("google", googleStrategy)

server.use("/users", userRouter)
server.use("/categories", categoryRouter)
server.use("/products", productRouter)
server.use("/pin", pinRouter)
server.use("/cart", cartRouter)
server.use("/checkout", stripeRouter)
server.use("/messages", messageRouter)
server.use("/chats", chatRouter)
server.use("/orders", orderRouter)

server.post("/webhook",  webhooks )


server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

mongoose.connect(process.env.MONGO_CON_URL!)

mongoose.connection.on("connected", () => {
    console.log("success")
    httpServer.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("server is listening on port:",port)
    })
})