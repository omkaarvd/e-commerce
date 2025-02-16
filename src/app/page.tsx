"use client";

import Product from "@/components/products/product";
import ProductSkeleton from "@/components/products/product-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectProduct } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

export default function Home() {
  const [filter, setFilter] = useState({
    sort: "none",
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<SelectProduct[]>("/api/products", {
        filter: { sort: filter.sort },
      });

      return data;
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High Quality Cotton Selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 size-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, sort: option.value }));
                  }}
                  className={cn("text-base", {
                    "text-gray-900 bg-gray-100": filter.sort === option.value,
                    "text-gray-500": filter.sort !== option.value,
                  })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="size-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* filters */}
          <div></div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {!products
              ? new Array(9)
                  .fill(null)
                  .map((_, idx) => <ProductSkeleton key={idx} />)
              : products.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
