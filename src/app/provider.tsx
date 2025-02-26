'use client';

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      {children}
    </HeroUIProvider>
  )
}
