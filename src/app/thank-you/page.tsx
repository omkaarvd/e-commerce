"use client";

import { Button } from "@/components/ui/button";
import { cleanCart } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { use } from "react";

type PageProps = {
  searchParams: Promise<{ u: string | undefined }>;
};

export default function ThankYouPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const userID = searchParams.u;

  const { userId } = useAuth();

  // Only show the form if the userID matches
  const showForm = userID && userId === userID;

  const handleForm = () => {
    cleanCart();

    window.location.replace("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-lg">Your order has been successfully placed.</p>
      <p className="text-lg">
        You will receive your order confirmation and tracking details via email.
      </p>
      {showForm && (
        <form action={handleForm} className="mt-4">
          <input type="hidden" name="userID" value={userID} />
          <Button type="submit">Clean Cart and back to Home</Button>
        </form>
      )}
    </div>
  );
}
