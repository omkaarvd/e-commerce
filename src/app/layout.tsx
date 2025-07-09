import CartDrawer from "@/components/cart-drawer";
import Nav from "@/components/nav";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E Commerce",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Providers>
            <Nav />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <CartDrawer />
            <Toaster />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
