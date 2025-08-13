'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

export default function AdSenseFooter() {
  useEffect(() => {
    try {
  const w = window as Window & { adsbygoogle?: unknown[] };
  (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, []);

  // If AdSense is not configured, render nothing
  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return null;

  return (
    <div className='w-full py-3'>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  );
}
