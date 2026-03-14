import { getTrips, getLocations } from "@/lib/trips";
import VisitedMapLoader from "@/components/VisitedMapLoader";

export const metadata = { title: "Visited" };

export default async function VisitedPage() {
  const [trips, locations] = await Promise.all([getTrips(), getLocations()]);
  return (
    <div
      className="mx-auto flex max-w-4xl flex-col md:px-6 md:pt-8 md:pb-6"
      style={{ height: "calc(100svh - 57px)" }}
    >
      <h2 className="mb-4 hidden shrink-0 text-xl font-bold md:block">Visited</h2>
      <div className="min-h-0 flex-1 h-full" style={{ isolation: "isolate" }}>
        <VisitedMapLoader trips={trips} locations={locations} />
      </div>
    </div>
  );
}
