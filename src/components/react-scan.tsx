import { type JSX, useEffect } from 'react';
import { scan } from 'react-scan';

export function ReactScan(): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      scan({
        enabled: true,
      });
    }
  }, []);

  return <></>;
}
