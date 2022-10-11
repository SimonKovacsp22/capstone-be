import {model,Schema,Types} from 'mongoose'

const categorySchema = new Schema({
    name:{type:String, required:true},
    subCategories:[{type:String ,ref:"Category"}]

})

export default model("Category", categorySchema)