'use client';

import { SessionProvider } from "next-auth/react";
import { CartSidebar } from "@/components/tienda/CartSidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CartSidebar />
    </SessionProvider>
  );
}
