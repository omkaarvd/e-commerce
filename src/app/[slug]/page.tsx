import ProductDisplay from "@/components/product-display";
import { getProductById } from "@/lib/db/products";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductById(slug);

  if (!product) {
    return (
      <h1 className="text-xl font-bold text-center text-red-500 mt-12">
        Product not found.
      </h1>
    );
  }

  return <ProductDisplay product={product} />;
}
