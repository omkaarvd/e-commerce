import ProductDisplay from "@/components/product-display";
import { SelectProduct } from "@/db/schema";
import axios from "axios";

type ProductWithoutMeta = Omit<
  SelectProduct,
  "createdAt" | "updatedAt" | "embedding"
>;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product } = await axios.get<ProductWithoutMeta>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`
  );

  return <ProductDisplay product={product} />;
}
