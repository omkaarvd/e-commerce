import ProductDisplay from "@/components/product-display";
import { SelectProduct } from "@/db/schema";
import { AXIOS } from "@/lib/axios";

type ProductWithoutMeta = Omit<
  SelectProduct,
  "createdAt" | "updatedAt" | "embedding"
>;

const getProduct = async (
  slug: string
): Promise<{
  data: ProductWithoutMeta | null;
  status: number;
}> => {
  try {
    const { data: product } = await AXIOS.get<ProductWithoutMeta>(
      `/api/products/${slug}`
    );

    return {
      data: product,
      status: 200,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      data: null,
      status: 404,
    };
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await getProduct(slug);

  if (!result.data || result.status !== 200) {
    return (
      <h1 className="text-xl font-bold text-center text-red-500 mt-12">
        Product not found.
      </h1>
    );
  }

  return <ProductDisplay product={result.data} />;
}
