import mongoose from "mongoose";
import ChatModel from "../apis/chat/model"
import MessageModel from "../apis/message/model"

let activeUsers :{userId:String, socketId:string} [] = [];

export const newConnectionHandler = (socket:any) => {

    socket.on("new-user-add", (newUserId:String) => {
        console.log(newUserId)
      if(newUserId !== null){ 
        if(activeUsers.length > 0 ){
           if (!activeUsers.some((user) => user.userId === newUserId)) {
          activeUsers.push({ userId: newUserId,socketId: socket.id });
          
        }
      }  else {
        activeUsers.push({ userId: newUserId,socketId: socket.id });
          
      }
    }
        // send all active users to new user
        
        socket.emit("get-users", activeUsers);
      });

      socket.on("send-message", (data:{receiverId:string,message:string})=> {
        const {receiverId,message } = data;

        const user = activeUsers.find( user => user.userId === receiverId)
        console.log(user)

        if(user) {
          socket.to(user.socketId).emit("receive-message", data )
        }
      })

      socket.on("disconnect" ,()=> {
        activeUsers = activeUsers.filter( user => user.socketId !== socket.id)
       
        socket.emit( "get-users", activeUsers)
      })

  

  
};
