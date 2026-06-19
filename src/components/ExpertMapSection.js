'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { getDictionary } from '@/lib/i18n';
import { RANK_LOGOS } from '@/lib/trainers';

// Local cluster helper — operates on the experts array passed in via props.
function clusterByCity(experts) {
  const groups = new Map();
  experts.forEach((e) => {
    const key =
      e.locationKey ||
      `coords-${Number(e.lat).toFixed(4)}-${Number(e.lng).toFixed(4)}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        city: e.city,
        country: e.country,
        district: e.district,
        experts: [],
      });
    }
    groups.get(key).experts.push(e);
  });
  return Array.from(groups.values());
}

/* ---------------------------------------------------------------------------
 * ExpertMapSection — interactive tile-based expert map.
 *
 *   Left  — dark Web Mercator map tiles with drag pan, wheel zoom, pinch
 *           zoom and real lat/lng expert markers.
 *
 *   Right — search panel. Two inputs (location + name) plus a live-
 *           filtered list. Selecting any expert flips the column to a
 *           profile view with rank, location and a phone-only contact
 *           block. Will be wired to Supabase later.
 * ------------------------------------------------------------------------- */

const TILE_SIZE = 256;
const DEFAULT_VIEW = { lat: 35, lng: 25, zoom: 3 };
const REGION_ZOOM = 8;
const EXPAND_CLUSTER_ZOOM = 7.35;
const MIN_ZOOM = 2;
const MAX_ZOOM = 14;
const ZOOM_STEP = 1;
const WHEEL_ZOOM_SPEED = 0.004;
const ZOOM_ANIMATION_MS = 220;
const TILE_SUBDOMAINS = ['a', 'b', 'c', 'd'];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const clampLat = (lat) => clamp(lat, -85.05112878, 85.05112878);
const normalizeLng = (lng) => ((((lng + 180) % 360) + 360) % 360) - 180;
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

function getTouchDistance(touches) {
  if (!touches || touches.length < 2) return 0;
  const [a, b] = touches;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function lngLatToWorld(lng, lat, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sin = Math.sin((clampLat(lat) * Math.PI) / 180);
  return {
    x: ((normalizeLng(lng) + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function worldToLngLat(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const mercatorY = 0.5 - y / scale;
  const lat =
    (90 - (360 * Math.atan(Math.exp(-mercatorY * 2 * Math.PI))) / Math.PI);
  return {
    lat: clampLat(lat),
    lng: normalizeLng(lng),
  };
}

function getTileUrl(z, x, y) {
  const subdomain = TILE_SUBDOMAINS[Math.abs(x + y) % TILE_SUBDOMAINS.length];
  return `https://${subdomain}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png`;
}

function getMarkerOffset(index, total) {
  if (total <= 1 || index === 0) return { x: 0, y: 0 };

  let remaining = index - 1;
  let ring = 1;
  while (remaining >= ring * 6) {
    remaining -= ring * 6;
    ring += 1;
  }

  const itemsInRing = ring * 6;
  const angle = (Math.PI * 2 * remaining) / itemsInRing - Math.PI / 2;
  const radius = ring * 22;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function coordinateKey(expert) {
  return `${Number(expert.lat).toFixed(4)}:${Number(expert.lng).toFixed(4)}`;
}

function expertMarkersForCluster(cluster) {
  const coordinateGroups = new Map();

  cluster.experts.forEach((expert) => {
    const key = coordinateKey(expert);
    if (!coordinateGroups.has(key)) coordinateGroups.set(key, []);
    coordinateGroups.get(key).push(expert);
  });

  return Array.from(coordinateGroups.values()).flatMap((group) =>
    group.map((expert, index) => ({
      kind: 'expert',
      expert,
      lat: expert.lat,
      lng: expert.lng,
      offset: getMarkerOffset(index, group.length),
    }))
  );
}

function ExpertAvatar({ expert, size = 'md' }) {
  const sz =
    size === 'lg' ? 'h-40 w-40' : size === 'sm' ? 'h-10 w-10' : 'h-16 w-16';
  const initials = (expert.name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('tr-TR');

  return (
    <div
      className={`relative ${sz} rounded-full overflow-hidden ring-[3px] ring-black/40 bg-neutral-900 shrink-0`}
    >
      {expert.photo ? (
        <Image
          src={expert.photo}
          alt={expert.name}
          fill
          sizes="160px"
          className="object-cover object-center"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-[#efb871] font-nav text-sm font-semibold text-black">
          {initials}
        </span>
      )}
    </div>
  );
}

function RankBadge({ rank, dict }) {
  const label = dict?.findCourse?.statuses?.[rank] || rank;
  const logo = RANK_LOGOS[rank];
  return (
    <span className="inline-flex items-center gap-2 font-nav text-ivory/85 text-[11px]">
      {logo && (
        <span className="relative h-4 w-4">
          <Image
            src={logo}
            alt=""
            fill
            sizes="20px"
            className="object-contain"
          />
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}

export default function ExpertMapSection({ locale = 'tr', experts = [] }) {
  const dict = getDictionary(locale);
  const mapDict = dict.expertMap;
  const ref = useGsapReveal();

  const [searchLocation, setSearchLocation] = useState('');
  const [searchName, setSearchName] = useState('');
  const [view, setView] = useState(DEFAULT_VIEW);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [selectedExpert, setSelectedExpert] = useState(null);
  const mapRef = useRef(null);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const viewRef = useRef(DEFAULT_VIEW);
  const zoomAnimationRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return undefined;
    const updateSize = () => {
      const rect = mapRef.current.getBoundingClientRect();
      setMapSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    return () => {
      if (zoomAnimationRef.current) cancelAnimationFrame(zoomAnimationRef.current);
    };
  }, []);

  const clusters = useMemo(() => {
    const mappableExperts = experts.filter(
      (expert) => Number.isFinite(expert.lat) && Number.isFinite(expert.lng)
    );
    return clusterByCity(mappableExperts).map((c) => {
      const totals = c.experts.reduce(
        (acc, expert) => ({
          lat: acc.lat + expert.lat,
          lng: acc.lng + expert.lng,
        }),
        { lat: 0, lng: 0 }
      );
      return {
        ...c,
        lat: totals.lat / c.experts.length,
        lng: totals.lng / c.experts.length,
      };
    });
  }, [experts]);

  const cancelViewAnimation = () => {
    if (zoomAnimationRef.current) {
      cancelAnimationFrame(zoomAnimationRef.current);
      zoomAnimationRef.current = null;
    }
  };

  const setViewState = (nextView) => {
    const normalized = {
      lat: clampLat(nextView.lat),
      lng: normalizeLng(nextView.lng),
      zoom: clamp(nextView.zoom, MIN_ZOOM, MAX_ZOOM),
    };
    viewRef.current = normalized;
    setView(normalized);
  };

  const animateToView = (targetView, duration = ZOOM_ANIMATION_MS) => {
    cancelViewAnimation();
    const start = viewRef.current;
    const target = {
      lat: clampLat(targetView.lat),
      lng: normalizeLng(targetView.lng),
      zoom: clamp(targetView.zoom, MIN_ZOOM, MAX_ZOOM),
    };
    const startTime = performance.now();
    const lngDelta = normalizeLng(target.lng - start.lng);

    const tick = (now) => {
      const t = clamp((now - startTime) / duration, 0, 1);
      const eased = easeOutCubic(t);
      setViewState({
        lat: start.lat + (target.lat - start.lat) * eased,
        lng: start.lng + lngDelta * eased,
        zoom: start.zoom + (target.zoom - start.zoom) * eased,
      });
      if (t < 1) {
        zoomAnimationRef.current = requestAnimationFrame(tick);
      } else {
        zoomAnimationRef.current = null;
      }
    };

    zoomAnimationRef.current = requestAnimationFrame(tick);
  };

  const setZoomAtPoint = (nextZoom, clientX, clientY) => {
    const baseView = viewRef.current;
    const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    if (!mapRef.current || Math.abs(zoom - baseView.zoom) < 0.01) return;

    const rect = mapRef.current.getBoundingClientRect();
    const oldCenter = lngLatToWorld(baseView.lng, baseView.lat, baseView.zoom);
    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;
    const anchor = worldToLngLat(oldCenter.x + offsetX, oldCenter.y + offsetY, baseView.zoom);
    const newAnchorWorld = lngLatToWorld(anchor.lng, anchor.lat, zoom);
    const nextCenter = worldToLngLat(newAnchorWorld.x - offsetX, newAnchorWorld.y - offsetY, zoom);
    animateToView({ ...nextCenter, zoom });
  };

  const setZoomAtCenter = (nextZoom) => {
    const baseView = viewRef.current;
    animateToView({
      ...baseView,
      zoom: clamp(nextZoom, MIN_ZOOM, MAX_ZOOM),
    });
  };

  const zoomBy = (delta) => {
    setZoomAtCenter(viewRef.current.zoom + delta);
  };

  const panBy = (deltaX, deltaY) => {
    cancelViewAnimation();
    const baseView = viewRef.current;
    const center = lngLatToWorld(baseView.lng, baseView.lat, baseView.zoom);
    const next = worldToLngLat(center.x - deltaX, center.y - deltaY, baseView.zoom);
    setViewState({ ...next, zoom: baseView.zoom });
  };

  const handleMapWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = clamp(-event.deltaY * WHEEL_ZOOM_SPEED, -0.55, 0.55);
    if (Math.abs(delta) < 0.01) return;
    setZoomAtPoint(viewRef.current.zoom + delta, event.clientX, event.clientY);
  };

  const handleMapPointerDown = (event) => {
    if (event.pointerType === 'touch') return;
    cancelViewAnimation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleMapPointerMove = (event) => {
    if (!dragRef.current) return;
    event.preventDefault();
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    dragRef.current = { x: event.clientX, y: event.clientY };
    panBy(deltaX, deltaY);
  };

  const handleMapPointerUp = (event) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      dragRef.current = null;
    }
  };

  const handleMapTouchStart = (event) => {
    if (event.touches.length === 1) {
      dragRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length >= 2) {
      pinchRef.current = {
        distance: getTouchDistance(event.touches),
        zoom: view.zoom,
      };
      dragRef.current = null;
    }
  };

  const handleMapTouchMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.touches.length >= 2 && pinchRef.current) {
      const nextDistance = getTouchDistance(event.touches);
      if (!nextDistance) return;
      const ratio = nextDistance / pinchRef.current.distance;
      if (ratio > 1.18 || ratio < 0.82) {
        setZoomAtCenter(pinchRef.current.zoom + (ratio > 1 ? 1 : -1));
        pinchRef.current = {
          distance: nextDistance,
          zoom: clamp(pinchRef.current.zoom + (ratio > 1 ? 1 : -1), MIN_ZOOM, MAX_ZOOM),
        };
      }
      return;
    }

    if (event.touches.length === 1 && dragRef.current) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - dragRef.current.x;
      const deltaY = touch.clientY - dragRef.current.y;
      dragRef.current = { x: touch.clientX, y: touch.clientY };
      panBy(deltaX, deltaY);
    }
  };

  const handleMapTouchEnd = (event) => {
    if (event.touches.length < 2) pinchRef.current = null;
    if (event.touches.length === 0) dragRef.current = null;
  };

  const handleClusterClick = (cluster) => {
    animateToView({ lat: cluster.lat, lng: cluster.lng, zoom: REGION_ZOOM }, 320);
  };

  const filteredExperts = useMemo(() => {
    const locQ = searchLocation.trim().toLowerCase();
    const nameQ = searchName.trim().toLowerCase();
    return experts.filter((e) => {
      if (locQ) {
        const inLoc =
          (e.city || '').toLowerCase().includes(locQ) ||
          (e.country || '').toLowerCase().includes(locQ);
        if (!inLoc) return false;
      }
      if (nameQ) {
        if (!(e.name || '').toLowerCase().includes(nameQ)) return false;
      }
      return true;
    });
  }, [searchLocation, searchName, experts]);

  // What gets pinned on the map: city clusters at world zoom, then one
  // arrow per expert once the user zooms into regional detail.
  const shouldExpandClusters = view.zoom >= EXPAND_CLUSTER_ZOOM;
  const markers = shouldExpandClusters
    ? clusters.flatMap(expertMarkersForCluster)
    : clusters.map((c) => ({
        kind: c.experts.length === 1 ? 'expert' : 'cluster',
        expert: c.experts[0],
        cluster: c,
        lat: c.lat,
        lng: c.lng,
        offset: { x: 0, y: 0 },
      }));
  const tileZoom = Math.floor(clamp(view.zoom, MIN_ZOOM, MAX_ZOOM));
  const tileScale = 2 ** (view.zoom - tileZoom);
  const centerWorld = lngLatToWorld(view.lng, view.lat, tileZoom);
  const markerCenterWorld = lngLatToWorld(view.lng, view.lat, view.zoom);
  const worldSize = TILE_SIZE * 2 ** view.zoom;
  const tileCount = 2 ** tileZoom;
  const halfWidth = mapSize.width / 2;
  const halfHeight = mapSize.height / 2;
  const tiles = [];

  if (mapSize.width && mapSize.height) {
    const visibleHalfWidth = halfWidth / tileScale;
    const visibleHalfHeight = halfHeight / tileScale;
    const startX = Math.floor((centerWorld.x - visibleHalfWidth) / TILE_SIZE) - 1;
    const endX = Math.floor((centerWorld.x + visibleHalfWidth) / TILE_SIZE) + 1;
    const startY = Math.max(0, Math.floor((centerWorld.y - visibleHalfHeight) / TILE_SIZE) - 1);
    const endY = Math.min(
      tileCount - 1,
      Math.floor((centerWorld.y + visibleHalfHeight) / TILE_SIZE) + 1
    );

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        tiles.push({
          key: `${tileZoom}-${x}-${y}`,
          url: getTileUrl(tileZoom, wrappedX, y),
          left: (x * TILE_SIZE - centerWorld.x) * tileScale + halfWidth,
          top: (y * TILE_SIZE - centerWorld.y) * tileScale + halfHeight,
        });
      }
    }
  }

  const screenMarkers = markers.map((marker) => {
    const point = lngLatToWorld(marker.lng, marker.lat, view.zoom);
    let deltaX = point.x - markerCenterWorld.x;
    if (deltaX > worldSize / 2) deltaX -= worldSize;
    if (deltaX < -worldSize / 2) deltaX += worldSize;
    return {
      ...marker,
      x: deltaX + halfWidth + (marker.offset?.x || 0),
      y: point.y - markerCenterWorld.y + halfHeight + (marker.offset?.y || 0),
    };
  });

  return (
    <section
      ref={ref}
      className="relative bg-black text-ivory overflow-hidden pt-28 md:pt-36 pb-28 md:pb-36"
      aria-label={mapDict.ariaLabel}
    >
      {/* Soft top hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-7 md:px-10">
        {/* ── Editorial header ───────────────────────────────────── */}
        <div className="max-w-[900px] mb-14 md:mb-20">
          <h1
            className="reveal mt-5 md:mt-7 font-logo text-ivory uppercase"
            style={{
              fontSize: 'clamp(54px, 10vw, 168px)',
              lineHeight: 0.92,
              fontWeight: 500,
            }}
          >
            {mapDict.title}
          </h1>
          <div
            className="reveal font-logo italic text-ivory mt-2 md:mt-3 flex items-baseline gap-3 md:gap-6"
            style={{
              fontSize: 'clamp(40px, 8vw, 140px)',
              lineHeight: 0.95,
              fontWeight: 500,
            }}
          >
            <span
              aria-hidden
              className="inline-block"
              style={{
                height: 1,
                width: 'clamp(24px, 6vw, 110px)',
                background: '#faf7f2',
                transform: 'translateY(-0.6em)',
                flex: '0 0 auto',
              }}
            />
            <span>{mapDict.subtitle}</span>
          </div>
          <p className="reveal mt-8 md:mt-10 max-w-[60ch] font-nav font-light text-ivory/80 text-[15px] md:text-[16px] leading-[1.85]">
            {mapDict.intro}
          </p>
        </div>

        {/* ── Map + form grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          {/* ── Map ─────────────────────────────────────────────── */}
          <div
            ref={mapRef}
            data-lenis-prevent
            onWheel={handleMapWheel}
            onPointerDown={handleMapPointerDown}
            onPointerMove={handleMapPointerMove}
            onPointerUp={handleMapPointerUp}
            onPointerCancel={handleMapPointerUp}
            onTouchStart={handleMapTouchStart}
            onTouchMove={handleMapTouchMove}
            onTouchEnd={handleMapTouchEnd}
            onTouchCancel={handleMapTouchEnd}
            className="reveal lg:col-span-7 relative aspect-[5/4] rounded-[10px] overflow-hidden border border-ivory/15 bg-[#0a0a0a]"
            style={{
              overscrollBehavior: 'contain',
              touchAction: 'none',
            }}
          >
            <div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              aria-hidden
            >
              {tiles.map((tile) => (
                <img
                  key={tile.key}
                  src={tile.url}
                  alt=""
                  draggable={false}
                  className="absolute select-none"
                  style={{
                    left: tile.left,
                    top: tile.top,
                    width: TILE_SIZE * tileScale,
                    height: TILE_SIZE * tileScale,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {screenMarkers.map((m, i) => {
                const inView =
                  m.x > -48 &&
                  m.x < mapSize.width + 48 &&
                  m.y > -64 &&
                  m.y < mapSize.height + 64;
                if (!inView) return null;

                if (m.kind === 'cluster') {
                  const count = m.cluster.experts.length;
                  return (
                    <button
                      key={`c-${m.cluster.key}`}
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onPointerMove={(event) => event.stopPropagation()}
                      onPointerUp={(event) => event.stopPropagation()}
                      onTouchStart={(event) => event.stopPropagation()}
                      onTouchMove={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClusterClick(m.cluster);
                      }}
                      className="pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a1410] bg-[#efb871] font-nav text-[12px] font-semibold text-[#1a1410] shadow-[0_0_0_10px_rgba(239,184,113,0.18),0_14px_28px_rgba(0,0,0,0.35)] transition-transform hover:scale-110"
                      style={{ left: m.x, top: m.y }}
                      aria-label={`${m.cluster.city}, ${count} ${mapDict.countLabel}`}
                    >
                      {count}
                    </button>
                  );
                }

                return (
                  <button
                    key={`e-${m.expert.id}-${i}`}
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerMove={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onTouchStart={(event) => event.stopPropagation()}
                    onTouchMove={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedExpert(m.expert);
                    }}
                    className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
                    style={{ left: m.x, top: m.y }}
                    aria-label={m.expert.name}
                  >
                    <span
                      className="block h-7 w-[22px] drop-shadow-[0_10px_12px_rgba(0,0,0,0.42)]"
                      style={{
                        clipPath:
                          'path("M11 0 C5 0 0 5 0 11 C0 18 8 24 11 28 C14 24 22 18 22 11 C22 5 17 0 11 0 Z")',
                        background: '#efb871',
                        border: '1px solid #1a1410',
                      }}
                    >
                      <span
                        className="absolute left-1/2 top-[7px] block h-2 w-2 -translate-x-1/2 rounded-full bg-[#1a1410]"
                        aria-hidden
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18))]" />

            <div className="absolute bottom-3 right-4 z-10 rounded-full bg-black/45 px-3 py-1 font-nav text-[10px] text-ivory/55 backdrop-blur-sm">
              © OpenStreetMap © CARTO
            </div>

            {/* Map controls */}
            <div
              className="absolute top-4 right-4 z-10 flex flex-col overflow-hidden rounded-full border border-ivory/25 bg-black/60 backdrop-blur-sm"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerMove={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onWheel={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => zoomBy(ZOOM_STEP)}
                aria-label={mapDict.zoomIn}
                className="flex h-10 w-10 items-center justify-center font-nav text-[18px] leading-none text-ivory hover:bg-ivory/10 transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                disabled={view.zoom >= MAX_ZOOM}
              >
                +
              </button>
              <span aria-hidden className="h-px w-full bg-ivory/15" />
              <button
                type="button"
                onClick={() => zoomBy(-ZOOM_STEP)}
                aria-label={mapDict.zoomOut}
                className="flex h-10 w-10 items-center justify-center font-nav text-[20px] leading-none text-ivory hover:bg-ivory/10 transition-colors disabled:cursor-not-allowed disabled:opacity-35"
                disabled={view.zoom <= MIN_ZOOM}
              >
                -
              </button>
            </div>
          </div>

          {/* ── Right column: form or expert detail ─────────────── */}
          <div className="lg:col-span-5 lg:pl-2">
            {selectedExpert ? (
              <div className="reveal">
                <button
                  type="button"
                  onClick={() => setSelectedExpert(null)}
                  className="inline-flex items-center gap-2 font-nav text-ivory/70 text-[12px] hover:text-ivory transition-colors mb-6"
                >
                  <span aria-hidden>←</span>
                  <span>{mapDict.backToSearch}</span>
                </button>

                <div className="flex items-start gap-6">
                  <ExpertAvatar expert={selectedExpert} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-display italic text-ivory"
                      style={{
                        fontSize: 'clamp(26px, 2.6vw, 40px)',
                        lineHeight: 1.05,
                        fontWeight: 500,
                      }}
                    >
                      {selectedExpert.name}
                    </h3>
                    <div className="mt-2">
                      <RankBadge rank={selectedExpert.rank} dict={dict} />
                    </div>
                    <p className="mt-3 font-nav text-ivory/80 text-[13px]">
                      <span className="text-ivory/55">
                        {mapDict.locationField}:
                      </span>{' '}
                      {selectedExpert.city}
                      {selectedExpert.country
                        ? `, ${selectedExpert.country}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-ivory/15 pt-6">
                  <span className="block font-nav text-ivory/55 text-[11px] font-semibold mb-4">
                    {mapDict.contact}
                  </span>
                  <ul className="space-y-3 font-nav text-[14px]">
                    {selectedExpert.contact?.phone && (
                      <li className="flex items-baseline gap-3">
                        <span className="text-ivory/55 w-24">
                          {mapDict.phoneLabel}
                        </span>
                        <a
                          href={`tel:${selectedExpert.contact.phone.replace(/\s/g, '')}`}
                          className="text-ivory hover:text-amber transition-colors"
                        >
                          {selectedExpert.contact.phone}
                        </a>
                      </li>
                    )}
                    {selectedExpert.contact?.address && (
                      <li className="flex items-baseline gap-3">
                        <span className="text-ivory/55 w-24">
                          {mapDict.addressLabel}
                        </span>
                        <span className="text-ivory leading-relaxed">
                          {selectedExpert.contact.address}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="reveal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <label className="block">
                    <span className="block font-nav text-ivory/55 text-[11px] font-semibold mb-2">
                      {mapDict.locationLabel}
                    </span>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder={mapDict.locationPlaceholder}
                      className="w-full bg-transparent border-b border-ivory/30 text-ivory font-nav text-[15px] py-3 px-1 placeholder:text-ivory/40 focus:outline-none focus:border-ivory transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="block font-nav text-ivory/55 text-[11px] font-semibold mb-2">
                      {mapDict.nameLabel}
                    </span>
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder={mapDict.namePlaceholder}
                      className="w-full bg-transparent border-b border-ivory/30 text-ivory font-nav text-[15px] py-3 px-1 placeholder:text-ivory/40 focus:outline-none focus:border-ivory transition-colors"
                    />
                  </label>
                </div>

                {/* Results list */}
                <div className="mt-10">
                  {filteredExperts.length === 0 ? (
                    <p className="font-nav text-ivory/65 text-[14px] py-8">
                      {mapDict.noResults}
                    </p>
                  ) : (
                    <ul
                      data-lenis-prevent
                      onWheel={(event) => event.stopPropagation()}
                      onTouchMove={(event) => event.stopPropagation()}
                      className="divide-y divide-ivory/10 max-h-[440px] overflow-y-auto pr-1"
                      style={{
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      {filteredExperts.map((e) => (
                        <li key={e.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedExpert(e)}
                            className="w-full flex items-center gap-4 py-4 text-left hover:bg-ivory/[0.03] transition-colors rounded-md px-1"
                          >
                            <ExpertAvatar expert={e} />
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-display italic text-ivory text-[16px] md:text-[18px]"
                                style={{ fontWeight: 500 }}
                              >
                                {e.name}
                              </div>
                              <div className="mt-1 flex items-center gap-3 font-nav text-ivory/70 text-[12px]">
                                <RankBadge rank={e.rank} dict={dict} />
                                <span aria-hidden className="text-ivory/30">·</span>
                                <span>
                                  {e.city}
                                  {e.country ? `, ${e.country}` : ''}
                                </span>
                              </div>
                            </div>
                            <span
                              aria-hidden
                              className="text-ivory/55 text-[14px]"
                            >
                              →
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
