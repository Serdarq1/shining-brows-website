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
      <div className="page-loader__brand" aria-hidden>
        <svg
          viewBox="0 0 200 200"
          className="page-loader__orbit animate-spin-slow"
        >
          <defs>
            <path
              id="page-loader-orbit-path"
              d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
              fill="none"
            />
          </defs>
          <text
            fill="#faf7f2"
            style={{
              fontFamily: 'var(--font-jost)',
              fontSize: 13,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            <textPath href="#page-loader-orbit-path" startOffset="0">
              {'SHINING BROWS · '.repeat(3)}
            </textPath>
          </text>
        </svg>
        <img
          src="/images/logo_white.png"
          alt=""
          width="220"
          height="80"
          className="page-loader__mark"
        />
      </div>
    </div>
  );
}
