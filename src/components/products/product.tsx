import { SelectProduct } from "@/db/schema";

export default function Product({ product }: { product: SelectProduct }) {
  return (
    <div className="group relative">
      <div className="w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageURL}
          alt={product.name}
          className="size-full object-center object-cover"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-gray-700">{product.name}</h3>
          <p className="mt-1 text-gray-500">
            Size {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className="text-gray-900 font-medium">₹{product.price}</p>
      </div>
    </div>
  );
}
