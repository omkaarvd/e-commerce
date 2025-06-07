import { SelectProduct } from "@/db/schema";
import { capetalizeFirstLetter, cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function Product({ product }: { product: SelectProduct }) {
  return (
    <Link href={`/${product.id}`}>
      <div className="group relative">
        <div className="w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageURL}
            alt={product.name}
            className="size-full object-center object-cover"
          />
        </div>

        <div className="mt-4 flex flex-col justify-between">
          <div className="flex flex-row justify-between items-center text-gray-900">
            <p>{product.name}</p>
            <p>{formatPrice(product.price)}</p>
          </div>

          <div className="flex flex-row justify-between items-center text-gray-500">
            <p>
              Size {product.size.toUpperCase()},{" "}
              {capetalizeFirstLetter(product.color)}
            </p>
            <p
              className={cn({
                "text-green-500": product.available > 0,
                "text-red-500": product.available === 0,
              })}
            >
              {product.available > 0
                ? `In Stock: ${product.available}`
                : "Out of Stock"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
