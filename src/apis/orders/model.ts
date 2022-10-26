import mongoose, {model,Schema,Types} from 'mongoose'

const orderSchema = new Schema({
    user:{type:mongoose.Types.ObjectId, required:true},
    status: { type: String, enum: ["Resolved", "Unresolved"],default:"Unresolved" },
    products:[{type:mongoose.Types.ObjectId, ref:'Product'}],
    amount:{type:String},

}, {
    timestamps:true,
})

export default model("Order", orderSchema)