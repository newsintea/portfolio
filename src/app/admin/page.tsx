import Link from "next/link";
import { getTrips } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminPage() {
  const trips = await getTrips();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Trips</h1>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/places/new">
              <Plus className="size-4" />
              New Place
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/trips/new">
              <Plus className="size-4" />
              New Trip
            </Link>
          </Button>
        </div>
      </div>

      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground">旅行記録がありません</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={`/admin/trips/${trip.id}`}
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: trip.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{trip.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {trip.started_at}
                    {trip.ended_at ? ` → ${trip.ended_at}` : ""}
                    {" · "}
                    {trip.visits.length} visits
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
