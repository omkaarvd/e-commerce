import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { purchasesTable } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const products = session.metadata?.products.split(",").map((p) => {
    const arr = p.split(":");
    return {
      productId: arr[0],
      quantity: Number(arr[1]),
    };
  });

  if (event.type === "checkout.session.completed") {
    if (!userId || !products) {
      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }

    await db.insert(purchasesTable).values(
      products.map(({ productId, quantity }) => ({
        id: session.id,
        userId,
        productId,
        quantity,
      }))
    );
  } else {
    return new Response(`Webhook Error: Unsupported event type ${event.type}`, {
      status: 200,
    });
  }

  return new Response(null, { status: 200 });
}
