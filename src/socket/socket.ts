import mongoose from "mongoose";
import ChatModel from "../apis/chat/model"
import MessageModel from "../apis/message/model"

let activeUsers :{userId:String, socketId:string} [];

export const newConnectionHandler = (socket:any) => {

    socket.on("new-user-add", (newUserId:String) => {
        // if user is not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
          activeUsers.push({ userId: newUserId,socketId: socket.id });
          console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        socket.emit("get-users", activeUsers);
      });

  

  
};
