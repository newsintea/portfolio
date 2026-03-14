"use client";

import dynamic from "next/dynamic";
import type { Trip, LocationEntry } from "@/lib/trips";

const VisitedMap = dynamic(() => import("@/components/VisitedMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

export default function VisitedMapLoader({
  trips,
  locations,
}: {
  trips: Trip[];
  locations: LocationEntry[];
}) {
  return <VisitedMap trips={trips} locations={locations} />;
}
