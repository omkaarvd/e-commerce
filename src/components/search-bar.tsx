import { Loader2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    startTransition(() => {
      router.push(`?query=${query.trim().replace(/ /g, "+")}`);
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isSearching}
        ref={inputRef}
        placeholder="Search cotton..."
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
