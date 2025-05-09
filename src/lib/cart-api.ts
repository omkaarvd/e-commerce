import { z } from "zod";
import { getCartProducts } from "./actions";
import { AXIOS } from "./axios";
import { CartItem } from "./cart-store";

const API_CALL_STR = "/api/user/cart";

const BackendDataValidator = z.object({
  cartItems: z.array(z.object({ productId: z.string(), quantity: z.number() })),
});

export interface MinifiedCartItem {
  productId: string;
  quantity: number;
}

export async function getCart(): Promise<CartItem[]> {
  try {
    const { data, status } = await AXIOS.get<MinifiedCartItem[]>(API_CALL_STR);

    if (status == 200) {
      const { cartItems } = BackendDataValidator.parse(data);
      return await getCartProducts(cartItems);
    }

    return [];
  } catch (err) {
    console.log("Failed to get Cart:", err);

    if (err instanceof z.ZodError) {
      console.log({ message: "Invalid request data", errors: err.errors });
    }

    return [];
  }
}

export async function addItemToCart(
  item: MinifiedCartItem
): Promise<CartItem[]> {
  try {
    const { data, status } = await AXIOS.post<MinifiedCartItem[]>(
      API_CALL_STR,
      { cartItem: item }
    );

    if (status == 200) {
      const { cartItems } = BackendDataValidator.parse(data);
      return await getCartProducts(cartItems);
    }

    return [];
  } catch (err) {
    console.log("Failed to add item to Cart:", err);

    if (err instanceof z.ZodError) {
      console.log({ message: "Invalid request data", errors: err.errors });
    }

    return [];
  }
}

export async function updateCartItem(item: MinifiedCartItem) {
  try {
    const { status } = await AXIOS.patch(API_CALL_STR, { cartItem: item });

    if (status == 200) {
      console.log("Item updated successfully");
    }
  } catch (err) {
    console.log("Failed to update item in the Cart:", err);
  }
}

export async function deleteCartItem({ productId }: { productId: string }) {
  try {
    const { status } = await AXIOS.delete(API_CALL_STR, {
      data: { productId },
    });

    if (status == 200) {
      console.log("Item deleted successfully");
    }
  } catch (err) {
    console.log("Failed to delete item in the Cart:", err);
  }
}
