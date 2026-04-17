import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    name: "Monthly",
    price: 9.99,
    interval: "month",
    prize_pool_contribution: 4.0,
    charity_min: 1.0,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    name: "Yearly",
    price: 99.99,
    interval: "year",
    prize_pool_contribution: 44.0,
    charity_min: 10.0,
  },
};
