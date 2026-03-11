import { supabase } from "./supabase";

export type Category = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export type Photo = {
  id: string;
  place_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export type Place = {
  id: string;
  trip_id: string | null;
  name: string;
  lat: number;
  lng: number;
  prefecture: string | null;
  visited_at: string | null;
  memo: string | null;
  rating: number | null;
  is_public: boolean;
  sort_order: number;
  categories: Category[];
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
  places: Place[];
};

export async function getTrips(): Promise<Trip[]> {
  const { data: trips, error } = await supabase
    .from("trips")
    .select(`
      *,
      places (
        *,
        photos ( * ),
        place_categories (
          categories ( * )
        )
      )
    `)
    .order("started_at", { ascending: false })
    .order("sort_order", { referencedTable: "places", ascending: true })
    .order("sort_order", { referencedTable: "places.photos", ascending: true });

  if (error) throw new Error(error.message);

  return (trips ?? []).map((trip) => ({
    ...trip,
    places: (trip.places ?? []).map((place: any) => ({
      ...place,
      categories: (place.place_categories ?? []).map(
        (pc: any) => pc.categories
      ),
      photos: place.photos ?? [],
    })),
  }));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const { data: trip, error } = await supabase
    .from("trips")
    .select(`
      *,
      places (
        *,
        photos ( * ),
        place_categories (
          categories ( * )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...trip,
    places: (trip.places ?? []).map((place: any) => ({
      ...place,
      categories: (place.place_categories ?? []).map(
        (pc: any) => pc.categories
      ),
      photos: place.photos ?? [],
    })),
  };
}
