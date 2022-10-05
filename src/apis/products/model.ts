import {model,Schema,Types} from 'mongoose'

const productSchema = new Schema({
    name:{type:String, required:true},
    description:{type:String},
    categories:[{type:Types.ObjectId, ref:"Category"}],
    price: {type:Number, required:true},
    parameters:[{type:Types.ObjectId, ref: "Params"}],
    madeBy:{type:String},
    image_path: {type:String},
    code:{type:String},
    availability:{ type:String, enum:["storage", "order"], default:"storage"},
    auxiliaries:{ type:Types.ObjectId, ref:"Product"}

},
{timestamps: true}
)

export default model("Product", productSchema)