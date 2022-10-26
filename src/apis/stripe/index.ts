import { RequestHandler } from "express";
import {buffer} from "micro";
import OrderModel from '../orders/model';
import UserModel from '../users/model';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        images: JSON.stringify(items.map((item:any) => item.productId.image_path)),
        products:JSON.stringify(items.map((item:any) => item.productId._id)),
      }
    });
  
    res.status(200).json({id: session.id});
  };

  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

  const fulfillOrder = async (session:any) => {
    console.log('here')
      const user = await UserModel.findOne({email: session.metadata.email})
      const order = new OrderModel({user,amount: session.amount_total / 100, products: JSON.parse(session.metadata.products)})
      await order.save()
  }

export const webhooks:RequestHandler =  async (req,res,next) => {
      console.log('here')
      const requestBuffer = await buffer(req);
      const payload = requestBuffer.toString();
      console.log(req.headers)
      const sig = req.headers["stripe-signature"];

      let event;
      try {
         event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

         if(event.type === 'checkout.session.completed') {
          const session = event.data.object
           await fulfillOrder(session)

           res.send({message:'success'})
        }
      } catch (error) {
        return res.status(400).send(`Webhook error:${error}`)
      }

      
    
}
