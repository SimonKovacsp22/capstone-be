import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [{type:mongoose.Types.ObjectId, ref:'User'}]
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;