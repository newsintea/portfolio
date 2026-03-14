import { supabase } from "./supabase";

export type Category = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export type Photo = {
  id: string;
  visit_id: string | null;
  url: string;
  caption: string | null;
  sort_order: number;
};

export type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  prefecture: string | null;
  category_ids: string[];
  categories: Category[];
};

export type Visit = {
  id: string;
  location_id: string;
  trip_id: string | null;
  visited_at: string | null;
  memo: string | null;
  rating: number | null;
  is_public: boolean;
  sort_order: number;
  location: Location;
  photos: Photo[];
};

export type Trip = {
  id: string;
  title: string;
  started_at: string;
  ended_at: string | null;
  color: string;
  prefectures: string[] | null;
  companions: string[] | null;
  memo: string | null;
  visits: Visit[];
};

function buildVisits(rawVisits: any[], categories: Category[]): Visit[] {
  return (rawVisits ?? []).map((visit: any) => ({
    ...visit,
    location: {
      ...visit.locations,
      categories: (visit.locations?.category_ids ?? [])
        .map((id: string) => categories.find((c) => c.id === id))
        .filter(Boolean) as Category[],
    },
    photos: visit.photos ?? [],
  }));
}

export async function getTrips(): Promise<Trip[]> {
  const [{ data: trips, error }, { data: allCategories }] = await Promise.all([
    supabase
      .from("trips")
      .select(`
        *,
        visits (
          *,
          photos ( * ),
          locations ( * )
        )
      `)
      .order("started_at", { ascending: false })
      .order("sort_order", { referencedTable: "visits", ascending: true })
      .order("sort_order", { referencedTable: "visits.photos", ascending: true }),
    supabase.from("categories").select("*"),
  ]);

  if (error) throw new Error(error.message);

  const categories = (allCategories ?? []) as Category[];

  return (trips ?? []).map((trip) => ({
    ...trip,
    visits: buildVisits(trip.visits, categories),
  }));
}

export type LocationEntry = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  prefecture: string | null;
  categories: Category[];
  visits: Array<{
    id: string;
    visited_at: string | null;
    memo: string | null;
    rating: number | null;
    is_public: boolean;
    trip: { id: string; title: string; color: string } | null;
    photos: Photo[];
  }>;
};

export async function getLocations(): Promise<LocationEntry[]> {
  const [{ data: locs, error }, { data: allCategories }, { data: allTrips }] = await Promise.all([
    supabase
      .from("locations")
      .select(`
        *,
        visits (
          id, visited_at, memo, rating, is_public, trip_id,
          photos ( id, url, caption, sort_order )
        )
      `)
      .order("name", { ascending: true })
      .order("sort_order", { referencedTable: "visits", ascending: true })
      .order("sort_order", { referencedTable: "visits.photos", ascending: true }),
    supabase.from("categories").select("*"),
    supabase.from("trips").select("id, title, color"),
  ]);

  if (error) throw new Error(error.message);

  const categories = (allCategories ?? []) as Category[];
  const tripMap = Object.fromEntries(
    (allTrips ?? []).map((t: any) => [t.id, { id: t.id, title: t.title, color: t.color }])
  );

  return (locs ?? []).map((loc: any) => ({
    id: loc.id,
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng,
    prefecture: loc.prefecture,
    categories: (loc.category_ids ?? [])
      .map((id: string) => categories.find((c) => c.id === id))
      .filter(Boolean) as Category[],
    visits: (loc.visits ?? []).map((v: any) => ({
      id: v.id,
      visited_at: v.visited_at,
      memo: v.memo,
      rating: v.rating,
      is_public: v.is_public,
      trip: v.trip_id ? (tripMap[v.trip_id] ?? null) : null,
      photos: (v.photos ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    })),
  }));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const [{ data: trip, error }, { data: allCategories }] = await Promise.all([
    supabase
      .from("trips")
      .select(`
        *,
        visits (
          *,
          photos ( * ),
          locations ( * )
        )
      `)
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*"),
  ]);

  if (error) return null;

  const categories = (allCategories ?? []) as Category[];

  return {
    ...trip,
    visits: buildVisits(trip.visits, categories),
  };
}
