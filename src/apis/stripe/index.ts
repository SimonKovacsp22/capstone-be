import { RequestHandler } from "express";
import { buffer } from "micro";
import OrderModel from "../orders/model";
import UserModel from "../users/model";
import CartModel from "../cart/model";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createSession: RequestHandler = async (req, res, next) => {
  const { items, email } = req.body;

  const transformedItems = items.map((item: any) => ({
    quantity: item.quantity,
    price_data: {
      currency: "eur",
      unit_amount: item.productId.price * 100,
      product_data: {
        name: item.productId.name,
        images: [item.productId.image_path],
        description: item.productId.description,
      },
    },
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["SK"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/canceled`,
    metadata: {
      email,
      images: JSON.stringify(
        items.map((item: any) => item.productId.image_path)
      ),
      products: JSON.stringify(items.map((item: any) => item.productId._id)),
    },
  });

  res.status(200).json({ id: session.id });
};

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session: any) => {
  console.log("session: ", session);

  try {
    if (session.metadata.email) {
      const user = await UserModel.findOne({ email: session.metadata.email });

      if (user) {
        const order = new OrderModel({
          user,
          amount: session.amount_total / 100,
          products: JSON.parse(session.metadata.products),
          guest: session.customer_details.email,
        });
        const { _id } = await order.save();
        user?.orders.push(_id);
        await user?.save();

        const cart = await CartModel.findOneAndUpdate(
          {
            owner: user._id,
            status: "Active",
          },
          { products: [] },
          { runValidators: true }
        );
      }
    } else if (!session.metadata.email && session.customer_details.email) {
      const order = new OrderModel({
        user: null,
        amount: session.amount_total / 100,
        products: JSON.parse(session.metadata.products),
        guest: session.customer_details.email,
      });
      await order.save();
    } else {
      console.log("ERROR, unidentified purchase attempt");
    }
  } catch (error) {
    console.log(error);
  }
};

export const webhooks: RequestHandler = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];

    let event = req.body;
    // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const paymentIntent = event.data.object;
      await fulfillOrder(paymentIntent);
      res.send({ received: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error:${error}`);
  }
};
