import { trips } from "@/data/trips";
import VisitedMapLoader from "@/components/VisitedMapLoader";

export const metadata = { title: "Visited" };

export default function VisitedPage() {
  return (
    <div
      className="mx-auto flex max-w-4xl flex-col px-6 pt-8 pb-6"
      style={{ height: "calc(100svh - 57px)" }}
    >
      <h2 className="mb-4 shrink-0 text-xl font-bold">Visited</h2>
      <div className="min-h-0 flex-1">
        <VisitedMapLoader trips={trips} />
      </div>
    </div>
  );
}
