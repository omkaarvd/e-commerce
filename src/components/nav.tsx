import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { History } from "lucide-react";
import Link from "next/link";
import CartIcon from "./cart-icon";
import { Button } from "./ui/button";

export default function Nav() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">E Commerce</h1>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button variant="default">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/orders">
              <History className="size-5" />
            </Link>
          </Button>

          <CartIcon />
        </div>
      </div>
    </header>
  );
}
