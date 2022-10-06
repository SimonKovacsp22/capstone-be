import {model, Schema} from 'mongoose'

const pinSchema = new Schema({
    pin: {type:String, required: true, minLength: 6,maxLength:6},
    email: {type:String, required: true},
    createdAt:{type:Date, required: true,default: Date.now()}
}
)

export default model("Pin", pinSchema)