import { db } from "@/db";
import { cartTable, usersTable } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

export const GET = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized! Please log in to continue", {
        status: 401,
      });
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!cart) {
      return new Response(JSON.stringify({ cartItems: [] }), { status: 200 });
    }

    return new Response(JSON.stringify({ cartItems: cart.items }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

const RequestBodyValidator = z.object({
  cartItem: z.object({
    productId: z.string(),
    quantity: z.number(),
  }),
});

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    const current_user = await currentUser();

    if (!userId || !current_user) {
      return new Response("Unauthorized! Please log in to continue", {
        status: 401,
      });
    }

    const body = await req.json();
    const { cartItem } = RequestBodyValidator.parse(body);

    if (!cartItem) {
      return new Response("No cart item provided", { status: 400 });
    }

    // Skipping Clerk webhook setup (like ngrok) for now — inserting user data manually here.
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: { email: true, stripeCustomerId: true },
    });

    if (!user) {
      await db.insert(usersTable).values({
        id: userId,
        email: current_user.primaryEmailAddress!.emailAddress,
      });
    }

    const isCartAlreadyExists = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!isCartAlreadyExists) {
      await db.insert(cartTable).values({ userId, items: [cartItem] });

      return new Response(JSON.stringify({ cartItems: [cartItem] }), {
        status: 200,
      });
    }

    await db
      .update(cartTable)
      .set({ items: [...isCartAlreadyExists.items, cartItem] })
      .where(eq(cartTable.userId, userId));

    return new Response(
      JSON.stringify({ cartItems: [...isCartAlreadyExists.items, cartItem] }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid request data", errors: err.errors }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { cartItem } = RequestBodyValidator.parse(body);

    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized! Please log in to continue", {
        status: 401,
      });
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!cart) {
      return new Response("No cart found", { status: 404 });
    }

    const updatedItems = cart.items.map((item) =>
      item.productId == cartItem.productId
        ? { ...item, quantity: cartItem.quantity }
        : item
    );

    await db
      .update(cartTable)
      .set({ items: updatedItems })
      .where(eq(cartTable.userId, userId));

    return new Response("Product item updated successfully", { status: 200 });
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid request data", errors: err.errors }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

const DeleteBodyValidator = z.object({
  productId: z.string(),
});

export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { productId } = DeleteBodyValidator.parse(body);

    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized! Please log in to continue", {
        status: 401,
      });
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!cart) {
      return new Response("No cart found", { status: 404 });
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    await db
      .update(cartTable)
      .set({ items: updatedItems })
      .where(eq(cartTable.userId, userId));

    return new Response("Product item deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid request data", errors: err.errors }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
