"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import type { Trip, TripLocation, Label } from "@/data/trips";

const LABEL_STYLES: Record<Label, string> = {
  観光:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  自然:     "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  グルメ:   "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  温泉:     "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  文化:     "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  ドライブ: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300",
};

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
    if (trip.locations.length === 1) {
      map.setView([trip.locations[0].lat, trip.locations[0].lng], 10, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(trip.locations.map((l) => [l.lat, l.lng]));
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

// ── Sidebar: Location detail ─────────────────────────────────────────────────
type ActiveLocation = { trip: Trip; location: TripLocation };

// ── 案A: カルーセル ──────────────────────────────────────────────────────────
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
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % photos.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-3 bg-white" : "w-1.5 bg-white/50"}`}
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
function LocationDetail({
  active,
  onBack,
}: {
  active: ActiveLocation;
  onBack: () => void;
}) {
  const { trip, location } = active;
  const photos = location.photos ?? [];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <button
        onClick={onBack}
        className="mb-3 flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        戻る
      </button>

      <PhotoCarousel photos={photos} alt={location.name} />

      <p className="mb-1.5 text-sm font-semibold leading-snug">{location.name}</p>

      {location.labels && location.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {location.labels.map((label) => (
            <span key={label} className={`rounded-full px-2 py-0.5 text-xs font-medium ${LABEL_STYLES[label]}`}>
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: trip.color }} />
        <p className="text-xs text-muted-foreground">
          {trip.title}
          {location.date && <span> · {location.date}</span>}
        </p>
      </div>

      {location.memo && (
        <p className="text-xs leading-relaxed text-muted-foreground">{location.memo}</p>
      )}
    </div>
  );
}

// ── Sidebar: Trip list (year → accordion) ────────────────────────────────────
function TripList({
  trips,
  openTripIds,
  onToggle,
  onLocationClick,
}: {
  trips: Trip[];
  openTripIds: Set<string>;
  onToggle: (id: string) => void;
  onLocationClick: (trip: Trip, location: TripLocation) => void;
}) {
  // Group by year, newest first
  const byYear = trips.reduce<Record<string, Trip[]>>((acc, trip) => {
    const year = trip.date.split(".")[0];
    (acc[year] ??= []).push(trip);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
  const totalLocations = trips.reduce((s, t) => s + t.locations.length, 0);

  return (
    <>
      <p className="mb-4 text-xs text-muted-foreground">
        {trips.length} trips · {totalLocations} places
      </p>

      <div className="space-y-5">
        {years.map((year) => (
          <div key={year}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{year}</p>
            <div className="space-y-0.5">
              {byYear[year].map((trip) => {
                const isOpen = openTripIds.has(trip.id);
                return (
                  <div key={trip.id}>
                    {/* Accordion header */}
                    <button
                      onClick={() => onToggle(trip.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
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
                        {trip.date.split(".")[1]}月
                      </span>
                    </button>

                    {/* Accordion body */}
                    {isOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {trip.locations.map((loc) => (
                          <button
                            key={loc.name}
                            onClick={() => onLocationClick(trip, loc)}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
                          >
                            {loc.photos?.[0] ? (
                              <img
                                src={loc.photos[0]}
                                alt={loc.name}
                                className="h-9 w-9 shrink-0 rounded object-cover"
                              />
                            ) : (
                              <span
                                className="h-9 w-9 shrink-0 rounded bg-muted"
                                style={{ border: `2px solid ${trip.color}20` }}
                              />
                            )}
                            <span className="min-w-0 truncate text-xs font-medium">
                              {loc.name}
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

  const handleMarkerClick = (trip: Trip, location: TripLocation) => {
    setActiveLocation({ trip, location });
  };

  const handleBack = () => {
    setActiveLocation(null);
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background p-4">
        {activeLocation ? (
          <LocationDetail active={activeLocation} onBack={handleBack} />
        ) : (
          <TripList
            trips={trips}
            openTripIds={openTripIds}
            onToggle={toggleTrip}
            onLocationClick={handleMarkerClick}
          />
        )}
      </aside>

      {/* Map */}
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
          trip.locations.map((location) => (
            <Marker
              key={`${trip.id}-${location.name}`}
              position={[location.lat, location.lng]}
              icon={createMarkerIcon(
                trip.color,
                activeLocation?.location.name === location.name &&
                  activeLocation?.trip.id === trip.id
              )}
              eventHandlers={{
                click: () => handleMarkerClick(trip, location),
              }}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
}
