import { db } from "@/db";
import { productsTable, usersTable } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const RequestBodyValidator = z.object({
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    const current_user = await currentUser();

    if (!userId || !current_user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const { products } = RequestBodyValidator.parse(body);

    const productDetails = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await db.query.productsTable.findFirst({
          where: eq(productsTable.id, productId),
          columns: {
            createdAt: false,
            updatedAt: false,
          },
        });

        if (!product) throw new Error(`Product not found: ${productId}`);

        if (product.available < quantity) {
          throw new Error(`Product out of stock: ${product.name}`);
        }

        return {
          name: product.name,
          quantity,
          price: product.price,
        };
      })
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      productDetails.map(({ name, price, quantity }) => ({
        price_data: {
          currency: "inr",
          product_data: { name },
          unit_amount: price * 100,
        },
        quantity,
      }));

    // Skipping Clerk webhook setup (like ngrok) for now — inserting user data manually here.
    // Get user and Stripe customer ID
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: { email: true, stripeCustomerId: true },
    });

    if (!user) {
      user = (
        await db
          .insert(usersTable)
          .values({
            id: userId,
            email: current_user.primaryEmailAddress!.emailAddress,
          })
          .returning({
            email: usersTable.email,
            stripeCustomerId: usersTable.stripeCustomerId,
          })
      )[0];
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: current_user.fullName!,
      });

      await db
        .update(usersTable)
        .set({ stripeCustomerId: customer.id })
        .where(eq(usersTable.id, userId));

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["IN", "US", "CA"] },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?u=${userId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: {
        userId,
        products: products
          .map(({ productId, quantity }) => `${productId}:${quantity}`)
          .join(","),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
