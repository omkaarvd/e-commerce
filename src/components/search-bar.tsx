import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SearchBar({
  refetch,
  defaultValue,
}: {
  refetch: () => void;
  defaultValue: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    let query = "";
    if (inputRef.current) {
      query = inputRef.current.value.trim();
    }

    const newSearchParams = new URLSearchParams(searchParams);

    startTransition(() => {
      if (query === "") {
        if (newSearchParams.has("query")) {
          newSearchParams.delete("query");
          refetch();
        }
      } else {
        newSearchParams.set("query", query);
        refetch();
      }

      router.push(`/?${newSearchParams.toString()}`);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative size-full">
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }

          if (e.key === "Escape") {
            inputRef.current?.blur();
          }
        }}
        defaultValue={defaultValue}
        disabled={isSearching}
        ref={inputRef}
        placeholder="Search..."
        className="peer"
      />

      <kbd className="absolute inset-y-0 right-14 hidden md:flex items-center select-none peer-focus:hidden">
        Ctrl + K
      </kbd>

      <Button
        onClick={handleSearch}
        disabled={isSearching}
        size="sm"
        className="absolute right-0 inset-y-0 h-full rounded-l-none"
      >
        {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
      </Button>
    </div>
  );
}
