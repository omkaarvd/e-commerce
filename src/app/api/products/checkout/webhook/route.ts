import { db } from "@/db";
import { productsTable, purchasesTable } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

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
    console.error("Stripe webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const productsRaw = session.metadata?.products;

  if (event.type === "checkout.session.completed") {
    if (!userId || !productsRaw) {
      console.error("Missing metadata in Stripe session:", {
        userId,
        productsRaw,
      });
      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }

    const products = productsRaw.split(",").map((p) => {
      const [productId, quantity] = p.split(":");
      return { productId, quantity: Number(quantity) };
    });

    try {
      await Promise.all(
        products.map(async ({ productId, quantity }) => {
          // insert the purchase into the database
          await db
            .insert(purchasesTable)
            .values({ id: crypto.randomUUID(), userId, productId, quantity });

          // update the product quantity in the database
          await db
            .update(productsTable)
            .set({ available: sql`${productsTable.available} - ${quantity}` })
            .where(eq(productsTable.id, productId));
        })
      );
      return new Response(null, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Database error during purchase processing:", err);
      return new Response(`Webhook Error: Database error`, { status: 500 });
    }
  }

  console.warn(`Received unsupported event type: ${event.type}`);
  return new Response(`Webhook Error: Unsupported event type ${event.type}`, {
    status: 200,
  });
}
