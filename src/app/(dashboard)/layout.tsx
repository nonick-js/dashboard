import NextTopLoader from 'nextjs-toploader';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader color='#006FEE' showSpinner={false} shadow={false} />
      {children}
    </>
  );
}
