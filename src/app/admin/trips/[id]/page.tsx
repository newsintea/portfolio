"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Trip } from "@/lib/trips";
import AddVisitForm from "./AddVisitForm";
import PhotoUploader from "./PhotoUploader";
import { ArrowLeft, Plus, Camera, ChevronDown, ChevronUp } from "lucide-react";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [photoUploadVisitId, setPhotoUploadVisitId] = useState<string | null>(null);
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function loadTrip() {
    setLoading(true);
    const res = await fetch(`/api/admin/trips/${id}`);
    if (res.ok) {
      const data = await res.json();
      setTrip(data);
    }
    setLoading(false);
  }

  function toggleVisit(visitId: string) {
    setExpandedVisits((prev) => {
      const next = new Set(prev);
      if (next.has(visitId)) next.delete(visitId);
      else next.add(visitId);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Trip not found
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/admin">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: trip.color }}
          />
          <h1 className="text-lg font-semibold">{trip.title}</h1>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {trip.started_at}
        {trip.ended_at ? ` → ${trip.ended_at}` : ""}
        {trip.prefectures?.length ? ` · ${trip.prefectures.join(", ")}` : ""}
      </p>

      {/* Add Visit */}
      <div className="mb-6">
        {showAddVisit ? (
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 font-medium">場所を追加</h2>
            <AddVisitForm
              tripId={trip.id}
              onDone={() => {
                setShowAddVisit(false);
                loadTrip();
              }}
            />
          </div>
        ) : (
          <Button onClick={() => setShowAddVisit(true)} className="w-full h-11">
            <Plus />
            場所を追加
          </Button>
        )}
      </div>

      {/* Visits list */}
      {trip.visits.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          まだ場所がありません
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {trip.visits.map((visit) => {
            const expanded = expandedVisits.has(visit.id);
            const isAddingPhotos = photoUploadVisitId === visit.id;

            return (
              <li key={visit.id} className="rounded-lg border overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 p-4 text-left hover:bg-accent transition-colors"
                  onClick={() => toggleVisit(visit.id)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{visit.location.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {visit.visited_at ?? "日付なし"}
                      {visit.photos.length > 0 ? ` · ${visit.photos.length}枚` : ""}
                      {visit.location.categories.length > 0
                        ? ` · ${visit.location.categories.map((c) => c.name).join(", ")}`
                        : ""}
                    </p>
                  </div>
                  {expanded ? (
                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {expanded && (
                  <div className="border-t px-4 pb-4">
                    {/* Photos */}
                    {visit.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-3">
                        {visit.photos.map((photo) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.caption ?? ""}
                            className="aspect-square w-full rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {/* Photo Uploader */}
                    {isAddingPhotos ? (
                      <div className="pt-3">
                        <PhotoUploader
                          visitId={visit.id}
                          tripId={trip.id}
                          onDone={() => {
                            setPhotoUploadVisitId(null);
                            loadTrip();
                          }}
                        />
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setPhotoUploadVisitId(visit.id)}
                      >
                        <Camera />
                        写真を追加
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
