import {model,Schema,Types} from 'mongoose'

const categorySchema = new Schema({
    name:{type:String, required:true},
    

})

export default model("SubCategory", categorySchema)