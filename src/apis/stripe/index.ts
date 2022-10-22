import { RequestHandler } from "express";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const createSession: RequestHandler =  async (req, res, next) => {

       const {items, email} = req.body

       const transformedItems = items.map( (item: any) => ({
        
        quantity: item.quantity,
        price_data: {
          currency:"eur",
          unit_amount: item.productId.price * 100,
          product_data:{
            name: item.productId.name,
            images:[item.productId.image_path],
            description: item.productId.description,
          }
        }
       }))
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      shipping_address_collection: {
        allowed_countries:["SK"]
      },
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/canceled`,
      metadata: {
        email,
        images: JSON.stringify(items.map((item:any) => item.productId.image_path))
      }
    });
  
    res.status(200).json({id: session.id});
  };