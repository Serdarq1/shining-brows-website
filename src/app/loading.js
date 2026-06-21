/* ---------------------------------------------------------------------------
 * Root loading UI — Next.js renders this whenever a route segment is
 * still streaming (server-component data fetch, dynamic route, etc.).
 *
 * Visually matches the first-load `<PageLoader />` chrome so navigation
 * between pages feels continuous instead of blank-white.
 * ------------------------------------------------------------------------- */

export default function Loading() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label="Yükleniyor"
    >
      <div className="page-loader__brand" aria-hidden>
        <svg viewBox="0 0 200 200" className="page-loader__orbit animate-spin-slow">
          <defs>
            <path
              id="route-loader-orbit-path"
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
              fontWeight: 600,
            }}
          >
            <textPath href="#route-loader-orbit-path" startOffset="0">
              {'Shining Brows · '.repeat(3)}
            </textPath>
          </text>
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
