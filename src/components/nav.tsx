import Link from "next/link";
import CartIcon from "./cart-icon";

export default function Nav() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">E Commerce</h1>
        </Link>
        <CartIcon />
      </div>
    </header>
  );
}
