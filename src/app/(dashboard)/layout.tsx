import { ProgressBar } from '@/components/providers/progressbar';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <ProgressBar>{children}</ProgressBar>;
}
