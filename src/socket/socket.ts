import mongoose from "mongoose";
import ChatModel from "../apis/chat/model";
import MessageModel from "../apis/message/model";

let activeUsers: { userId: String; socketId: string }[] = [];

export const newConnectionHandler = (io: any) => {
  io.on("connection", (socket: any) => {
    socket.on("new-user-add", (newUserId: String) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
      }
      io.emit("get-users", activeUsers);
    });

    socket.on(
      "send-message",
      (data: {
        receiverId: string;
        text: string;
        chatId: string;
        senderId: string;
        createdAt: Date;
      }) => {
        const { receiverId, text } = data;
        console.log(data);

        const user = activeUsers.find((user) => user.userId === receiverId);

        if (user) {
          socket.to(user.socketId).emit("receive-message", data);
        }
      }
    );

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

      io.emit("get-users", activeUsers);
    });
  });
};
