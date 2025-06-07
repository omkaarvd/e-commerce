"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AXIOS } from "@/lib/axios";
import { cn, formatDate, formatPrice, getTotalPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const BackendDataValidator = z.object({
  orders: z.array(
    z.object({
      imageURL: z.string(),
      name: z.string(),
      size: z.string(),
      color: z.string(),
      price: z.number(),
      available: z.number(),
      description: z.string().or(z.null()),
      productId: z.string(),
      orderId: z.string(),
      purchasedQuantity: z.number(),
      createdAt: z.date().or(z.null()).or(z.string()),
    })
  ),
});

async function getOrders() {
  try {
    const { data, status } = await AXIOS.get("/api/user/orders");

    if (status == 200) {
      const { orders } = BackendDataValidator.parse(data);
      return orders;
    }

    return [];
  } catch (err) {
    console.log("Failed to get orders:", err);

    if (err instanceof z.ZodError) {
      console.log({ message: "Invalid request data", errors: err.errors });
    }

    return [];
  }
}

export default function Orders() {
  let { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (!orders) orders = [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Past Orders</h1>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {`You haven't placed any orders yet.`}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.orderId} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Order #{order.orderId.split("-")[0]}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Link href={`/${order.productId}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.imageURL}
                      alt={order.name}
                      height={120}
                      width={120}
                      // className="size-full object-center object-cover"
                      className="rounded-lg object-cover border"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Link href={`/${order.productId}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:underline">
                        {order.name}
                      </h3>
                    </Link>
                    {order.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {order.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Size
                      </p>
                      <p className="font-semibold">{order.size}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Color
                      </p>
                      <p className="font-semibold">{order.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Quantity
                      </p>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="font-semibold">
                          {order.purchasedQuantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Availability
                      </p>
                      <Badge
                        className={cn({ "bg-red-500": order.available <= 0 })}
                      >
                        {order.available} in stock
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Unit Price: {formatPrice(order.price)}
                      </p>
                      <p className="text-lg font-bold">
                        Total:{" "}
                        {getTotalPrice(order.price, order.purchasedQuantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
