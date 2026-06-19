'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => setIsVisible(false);

    if (document.readyState === 'complete') {
      requestAnimationFrame(hideLoader);
      return undefined;
    }

    window.addEventListener('load', hideLoader, { once: true });
    return () => window.removeEventListener('load', hideLoader);
  }, []);

  return (
    <div
      className={`page-loader${isVisible ? '' : ' page-loader--hidden'}`}
      role="status"
      aria-live="polite"
      aria-label="Site yükleniyor"
      aria-hidden={!isVisible}
    >
      <img
        src="/images/logo_white.png"
        alt=""
        width="320"
        height="228"
        className="page-loader__logo"
      />
    </div>
  );
}
