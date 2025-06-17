// app/userfacing/layout.tsx
'use client';
import { ReactNode } from "react";
import { Nav, NavLink } from "@/components/Nav";
import { SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import LoginButton from "@/components/login-btn";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Nav
          actions={
            <>
              <Button variant="ghost" size="icon" asChild className="hover:bg-accent hover:text-accent-foreground">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
              <LoginButton />
            </>
          }
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/orders">Orders</NavLink>
        </Nav>
        <main className="flex-1">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
