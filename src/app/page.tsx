"use client";

import { Suspense } from "react";
import { CustomPagination } from "@/components/custom-pagination";
import EmptyState from "@/components/empty-state";
import Product from "@/components/product-component";
import ProductSkeleton from "@/components/product-skeleton";
import SearchBar from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { SelectProduct } from "@/db/schema";
import { AXIOS } from "@/lib/axios";
import {
  COLORS_FILTERS,
  DEFAULT_CUSTOM_PRICE,
  SIZE_FILTERS,
  SORT_OPTIONS,
} from "@/lib/filters";
import { ProductState } from "@/lib/product-validator";
import { cn, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { ChevronDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";

// Create a loading component for the suspense fallback
function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between gap-4 border-gray-200 py-6">
        <div className="h-10 bg-gray-200 rounded-md flex-1 max-w-md"></div>
        <div className="h-10 bg-gray-200 rounded-md w-20"></div>
      </div>
      <section className="pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-24"></div>
                ))}
              </div>
            </div>
          </div>
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialState = useMemo(() => {
    const colorParam = searchParams.get("color");
    const sizeParam = searchParams.get("size");
    const priceParam = searchParams.get("price");
    const sortParam = searchParams.get("sort");

    return {
      sort: (sortParam as ProductState["sort"]) || "none",
      color: colorParam ? (colorParam.split(",") as never) : [],
      size: sizeParam ? (sizeParam.split(",") as never) : [],
      price: {
        range: priceParam
          ? (priceParam.split("-").map(Number) as [number, number])
          : DEFAULT_CUSTOM_PRICE,
      },
    };
  }, [searchParams]);

  // Single source of truth for filter state
  const [filterState, setFilterState] = useState<ProductState>(initialState);

  // Temporary UI state for slider (only for price slider interaction)
  const [tempSliderValue, setTempSliderValue] = useState<[number, number]>(
    filterState.price.range
  );

  // State to track pending URL updates
  const [pendingUrlUpdate, setPendingUrlUpdate] = useState<Record<
    string,
    string | null
  > | null>(null);

  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";

  // Sync state when URL changes (back/forward navigation)
  useEffect(() => {
    setFilterState(initialState);
    setTempSliderValue(initialState.price.range);
  }, [initialState]);

  const {
    data: products,
    refetch: refetchProducts,
    isFetching: isFetchingProducts,
  } = useQuery({
    queryKey: ["products", filterState, query, page],
    queryFn: async () => {
      const { data } = await AXIOS.post<{
        data: SelectProduct[];
        count: number;
      }>("/api/products", {
        filter: {
          sort: filterState.sort,
          color: filterState.color,
          price: filterState.price.range,
          size: filterState.size,
        },
        query,
        page,
      });

      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedRefetch = useCallback(debounce(refetchProducts, 700), []);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      router.push(`/?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  // Handle pending URL updates in useEffect to avoid setState during render
  useEffect(() => {
    if (pendingUrlUpdate) {
      updateSearchParams(pendingUrlUpdate);
      setPendingUrlUpdate(null);
    }
  }, [pendingUrlUpdate, updateSearchParams]);

  const applyColorAndSizeFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<ProductState, "price" | "sort">;
    value: string;
  }) => {
    setFilterState((prev) => {
      const prevValues = prev[category];
      const updatedValues = prevValues.includes(value as never)
        ? prevValues.filter((val) => val !== value)
        : [...prevValues, value];

      // Schedule URL update for next render cycle
      setPendingUrlUpdate({
        [category]: updatedValues.length > 0 ? updatedValues.join(",") : null,
        page: "1",
      });

      return {
        ...prev,
        [category]: updatedValues,
      };
    });

    debouncedRefetch();
  };

  const handleSortChange = useCallback(
    (sortValue: ProductState["sort"]) => {
      setFilterState((prev) => ({
        ...prev,
        sort: sortValue,
      }));

      // Use setTimeout to defer URL update
      setTimeout(() => {
        updateSearchParams({
          sort: sortValue !== "none" ? sortValue : null,
          page: "1",
        });
      }, 0);

      debouncedRefetch();
    },
    [debouncedRefetch, updateSearchParams]
  );

  const handleSliderChange = useCallback((range: [number, number]) => {
    setTempSliderValue(range);

    setFilterState((prev) => ({
      ...prev,
      price: { range },
    }));

    // Use setTimeout to defer URL update
    setTimeout(() => {
      updateSearchParams({
        price: `${range[0]}-${range[1]}`,
        page: "1",
      });
    }, 0);

    debouncedRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-gray-200 py-6">
        <SearchBar refetch={debouncedRefetch} defaultValue={query || ""} />

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
                  onClick={() => handleSortChange(option.value)}
                  className={cn("text-base", {
                    "text-gray-900 bg-gray-100":
                      filterState.sort === option.value,
                    "text-gray-500": filterState.sort !== option.value,
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

      <section className="pb-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* filters */}
          <div className="hidden lg:block space-y-8">
            {/* Color filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Color</h3>
              <div className="space-y-4">
                {COLORS_FILTERS.options.map((option, idx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`color-${idx}`}
                      className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={() => {
                        applyColorAndSizeFilter({
                          category: "color",
                          value: option.value,
                        });
                      }}
                      checked={filterState.color.includes(option.value)}
                    />
                    <label
                      htmlFor={`color-${idx}`}
                      className="ml-3 text-gray-600 text-sm"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Size filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Size</h3>
              <div className="space-y-4">
                {SIZE_FILTERS.options.map((option, idx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`size-${idx}`}
                      className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={() => {
                        applyColorAndSizeFilter({
                          category: "size",
                          value: option.value,
                        });
                      }}
                      checked={filterState.size.includes(option.value)}
                    />
                    <label
                      htmlFor={`size-${idx}`}
                      className="ml-3 text-gray-600 text-sm"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-700">Range</p>
                  <div className="text-sm text-gray-600">
                    {formatPrice(filterState.price.range[0], 0)} -{" "}
                    {formatPrice(filterState.price.range[1], 0)}
                  </div>
                </div>

                <Slider
                  onValueChange={handleSliderChange}
                  value={tempSliderValue}
                  min={DEFAULT_CUSTOM_PRICE[0]}
                  max={DEFAULT_CUSTOM_PRICE[1]}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {isFetchingProducts ? (
              Array.from({ length: 9 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))
            ) : !products || products.data.length === 0 ? (
              <EmptyState />
            ) : (
              products.data.map((product) => (
                <Product key={product.id} product={product} />
              ))
            )}

            {/* Pagination */}
            <div className="text-center col-span-3">
              <CustomPagination
                page={parseInt(page)}
                pageSize={9}
                totalCount={products?.count || 0}
              />
            </div>
          </ul>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
