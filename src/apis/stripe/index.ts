import { RequestHandler } from "express";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const createSession: RequestHandler =  async (req, res, next) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 20,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}?success=true`,
      cancel_url: `${process.env.DOMAIN}?canceled=true`,
    });
  
    res.redirect(303, session.url);
  };