import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      const subscriptionId = session.subscription as string;

      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await supabase.from("profiles").update({
        subscription_status: "active",
        subscription_plan: plan,
        stripe_subscription_id: subscriptionId,
        subscription_renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
      }).eq("id", userId);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.user_id;
      if (!userId) break;

      await supabase.from("profiles").update({
        subscription_status: "active",
        subscription_renewal_date: new Date(subscription.current_period_end * 1000).toISOString(),
      }).eq("id", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      if (!userId) break;
      await supabase.from("profiles").update({
        subscription_status: "lapsed",
        stripe_subscription_id: null,
      }).eq("id", userId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      if (!subscriptionId) break;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = sub.metadata?.user_id;
      if (!userId) break;
      await supabase.from("profiles").update({ subscription_status: "lapsed" }).eq("id", userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
