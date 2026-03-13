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
