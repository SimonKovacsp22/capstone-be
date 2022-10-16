import { RequestHandler } from "express";
import UserModel from "../users/model";
import CartModel from "../cart/model";
import ProductModel from "../products/model"
import createHttpError from "http-errors";

export const addItemToCart: RequestHandler = async (req, res, next) => {
  try {

    const { productId, quantity } = req.body

    
    const user = await UserModel.findById(req.params.userId)
    if (!user) return next(createHttpError(404, `User with id ${req.params.userId} not found!`))

   
    const purchasedProduct = await ProductModel.findById(productId)
    if (!purchasedProduct) return next(createHttpError(404, `Product with id ${productId} not found!`))

    
    const isProductThere = await CartModel.findOne({ owner: req.params.userId, status: "Active", "products.productId": productId })

         if(isProductThere) {
            const modifiedCart = await CartModel.findOneAndUpdate(
                { owner: req.params.userId, status: "Active", "products.productId": productId },
                { $inc: { "products.$.quantity": quantity } },
                { new: true, runValidators: true } )
              
        
              res.send(modifiedCart)
            } else {
              
              const modifiedCart = await CartModel.findOneAndUpdate(
                { owner: req.params.userId, status: "Active" }, 
                { $push: { products: { productId: productId, quantity } } }, 
                { new: true, runValidators: true, upsert: true } )
        
              res.send(modifiedCart)
         }
  } catch (error) {
    next(error);
  }
};
export const getCartByUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);

    if (user) {
      const cart = await CartModel.findOneAndUpdate(
        {
          owner: req.params.userId,
          status: "Active",
        },
        {},
        { new: true, runValidators: true, upsert: true }
      ).populate({path:"products.productId"})


    let quantity:number = 0;
    
    cart.products.forEach( product => {
      quantity += product.quantity
    })

      res.send({cart,quantity});
    } else {
      next(
        createHttpError(404, `User with id:${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
};


export const removeItemFromCart: RequestHandler = async (req,res,next) => {
  try {
    const { productId } = req.body

    
    const user = await UserModel.findById(req.params.userId)
    if (!user) return next(createHttpError(404, `User with id ${req.params.userId} not found!`))

   
    const purchasedProduct = await ProductModel.findById(productId)
    if (!purchasedProduct) return next(createHttpError(404, `Product with id ${productId} not found!`))

    
    const isProductThere = await CartModel.findOne({ owner: req.params.userId, status: "Active", "products.productId": productId })

    

    

         if(isProductThere) { 
          
          const currProduct = isProductThere.products.find( product => product.productId?.toString() === productId)

         

          
            if(currProduct) {
                if(currProduct.quantity > 1){
                            const modifiedCart = await CartModel.findOneAndUpdate(
                                { owner: req.params.userId, status: "Active", "products.productId": productId },
                                { $inc: { "products.$.quantity": -1} },
                                { new: true, runValidators: true } )

                                res.send(modifiedCart)
                          }else {
                            const modifiedCart = await CartModel.findOneAndUpdate(
                              { owner: req.params.userId, status: "Active", "products.productId": productId },
                              { $pull:{products: {productId: productId}}},
                              { new: true, runValidators: true } )
                              
                              res.send(modifiedCart)
                          }
                      
                             }
                              }

                    else{
                      next(createHttpError(404, `Product with id:${productId} not found!`))
                    }
} catch (error) {
    
  }
}
