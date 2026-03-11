"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import type { Trip, Place } from "@/lib/trips";

// ── Constants ────────────────────────────────────────────────────────────────
const INITIAL_CENTER: [number, number] = [36.2048, 138.2529];
const INITIAL_ZOOM = 5;

// ── Marker icon ──────────────────────────────────────────────────────────────
function createMarkerIcon(color: string, active = false) {
  const size = active ? 16 : 12;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ── Map sub-components ───────────────────────────────────────────────────────
function MapController({ trip }: { trip: Trip | null }) {
  const map = useMap();
  useEffect(() => {
    if (!trip) {
      map.setView(INITIAL_CENTER, INITIAL_ZOOM, { animate: true });
      return;
    }
    if (trip.places.length === 1) {
      map.setView([trip.places[0].lat, trip.places[0].lng], 10, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(trip.places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10, animate: true });
  }, [map, trip]);
  return null;
}

function ResetViewButton() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: "80px" }}>
      <div className="leaflet-control leaflet-bar">
        <a
          href="#"
          role="button"
          title="全体表示に戻す"
          onClick={(e) => {
            e.preventDefault();
            map.setView(INITIAL_CENTER, INITIAL_ZOOM, { animate: true });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            textDecoration: "none",
            color: "#333",
            cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ── Photo carousel ────────────────────────────────────────────────────────────
function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "4/3" }}>
        <img src={photos[index]} alt={alt} className="h-full w-full object-cover" />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % photos.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${i === index ? "w-3 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── 詳細ビュー ────────────────────────────────────────────────────────────────
type ActiveLocation = { trip: Trip; place: Place };

function LocationDetail({
  active,
  onBack,
}: {
  active: ActiveLocation;
  onBack: () => void;
}) {
  const { trip, place } = active;
  const photoUrls = (place.photos ?? []).map((p) => p.url);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <button
        onClick={onBack}
        className="mb-3 flex shrink-0 cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        戻る
      </button>

      <PhotoCarousel photos={photoUrls} alt={place.name} />

      <p className="mb-1.5 text-sm font-semibold leading-snug">{place.name}</p>

      {place.categories && place.categories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {place.categories.map((cat) => (
            <span
              key={cat.id}
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={
                cat.color
                  ? { backgroundColor: `${cat.color}20`, color: cat.color }
                  : undefined
              }
            >
              {cat.icon && <span className="mr-0.5">{cat.icon}</span>}
              {cat.name}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: trip.color }} />
        <p className="text-xs text-muted-foreground">
          {trip.title}
          {place.visited_at && <span> · {place.visited_at}</span>}
        </p>
      </div>

      {place.memo && (
        <p className="text-xs leading-relaxed text-muted-foreground">{place.memo}</p>
      )}
    </div>
  );
}

// ── Sidebar: Trip list (year → accordion) ────────────────────────────────────
function TripList({
  trips,
  openTripIds,
  onToggle,
  onPlaceClick,
}: {
  trips: Trip[];
  openTripIds: Set<string>;
  onToggle: (id: string) => void;
  onPlaceClick: (trip: Trip, place: Place) => void;
}) {
  const byYear = trips.reduce<Record<string, Trip[]>>((acc, trip) => {
    const year = trip.started_at.split("-")[0];
    (acc[year] ??= []).push(trip);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
  const totalPlaces = trips.reduce((s, t) => s + t.places.length, 0);

  return (
    <>
      <p className="mb-4 text-xs text-muted-foreground">
        {trips.length} trips · {totalPlaces} places
      </p>

      <div className="space-y-5">
        {years.map((year) => (
          <div key={year}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{year}</p>
            <div className="space-y-0.5">
              {byYear[year].map((trip) => {
                const isOpen = openTripIds.has(trip.id);
                const month = parseInt(trip.started_at.split("-")[1], 10);
                return (
                  <div key={trip.id}>
                    <button
                      onClick={() => onToggle(trip.id)}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: trip.color }}
                      />
                      <span className="min-w-0 truncate font-medium">{trip.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {month}月
                      </span>
                    </button>

                    {isOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {trip.places.map((place) => (
                          <button
                            key={place.id}
                            onClick={() => onPlaceClick(trip, place)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
                          >
                            {place.photos?.[0]?.url ? (
                              <img
                                src={place.photos[0].url}
                                alt={place.name}
                                className="h-9 w-9 shrink-0 rounded object-cover"
                              />
                            ) : (
                              <span
                                className="h-9 w-9 shrink-0 rounded bg-muted"
                                style={{ border: `2px solid ${trip.color}20` }}
                              />
                            )}
                            <span className="min-w-0 truncate text-xs font-medium">
                              {place.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function VisitedMap({ trips }: { trips: Trip[] }) {
  const [openTripIds, setOpenTripIds] = useState<Set<string>>(new Set());
  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);
  const { resolvedTheme } = useTheme();

  const activeTripForController =
    activeLocation
      ? trips.find((t) => t.id === activeLocation.trip.id) ?? null
      : null;

  const tileUrl =
    resolvedTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const toggleTrip = (id: string) => {
    setOpenTripIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background p-4">
        {activeLocation ? (
          <LocationDetail active={activeLocation} onBack={() => setActiveLocation(null)} />
        ) : (
          <TripList
            trips={trips}
            openTripIds={openTripIds}
            onToggle={toggleTrip}
            onPlaceClick={(trip, place) => setActiveLocation({ trip, place })}
          />
        )}
      </aside>

      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        zoomSnap={0.5}
        style={{ flex: 1, height: "100%" }}
      >
        <TileLayer
          key={resolvedTheme}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapController trip={activeTripForController} />
        <ResetViewButton />

        {trips.flatMap((trip) =>
          trip.places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createMarkerIcon(
                trip.color,
                activeLocation?.place.id === place.id &&
                  activeLocation?.trip.id === trip.id
              )}
              eventHandlers={{
                click: () => setActiveLocation({ trip, place }),
              }}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
}
