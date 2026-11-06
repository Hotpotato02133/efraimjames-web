import { useEffect, useState } from 'react';

// Renders `initial` (the bundled fallback snapshot) immediately, then swaps in
// live data once `fetcher` resolves — no loading flicker, no empty state.
// `fetcher` must be a stable reference (e.g. an import from lib/content.ts).
export function useContent<T>(fetcher: () => Promise<T>, initial: T): T {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    let active = true;
    fetcher().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, [fetcher]);

  return data;
}
