import { XCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="relative col-span-full h-80 w-full p-12 flex flex-col items-center justify-center">
      <XCircle className="size-8 text-red-500" />
      <h3 className="font-semibold text-2xl">No products found</h3>
      <p className="text-zinc-500">
        We found no search results for these filters.
      </p>
    </div>
  );
}
 