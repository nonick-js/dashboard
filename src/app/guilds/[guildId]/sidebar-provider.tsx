'use client';

import { useDisclosure } from '@heroui/use-disclosure';
import { type ReactNode, createContext } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  onOpen: () => {},
  onOpenChange: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return <SidebarContext value={{ isOpen, onOpen, onOpenChange }}>{children}</SidebarContext>;
}
