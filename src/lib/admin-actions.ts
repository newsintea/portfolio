"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== process.env.ADMIN_PASSWORD) {
    throw new Error("Unauthorized");
  }
}

// ────────────────────────────────────────────
// Trip
// ────────────────────────────────────────────

export type TripInput = {
  id: string;
  title: string;
  started_at: string;
  ended_at?: string | null;
  color: string;
  prefectures?: string[] | null;
  companions?: string[] | null;
  memo?: string | null;
};

export async function createTrip(input: TripInput) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("trips")
    .insert({
      id: input.id,
      title: input.title,
      started_at: input.started_at,
      ended_at: input.ended_at ?? null,
      color: input.color,
      prefectures: input.prefectures ?? null,
      companions: input.companions ?? null,
      memo: input.memo ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ────────────────────────────────────────────
// Visit + Location
// ────────────────────────────────────────────

export type VisitInput = {
  trip_id?: string | null;
  name: string;
  lat: number;
  lng: number;
  prefecture?: string | null;
  category_ids?: string[];
  visited_at?: string | null;
  memo?: string | null;
  rating?: number | null;
  is_public?: boolean;
  sort_order?: number;
};

export async function createVisit(input: VisitInput) {
  await requireAdmin();

  // Get current max sort_order
  let existingVisitsQuery = supabaseAdmin
    .from("visits")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  if (input.trip_id) existingVisitsQuery = existingVisitsQuery.eq("trip_id", input.trip_id);
  const { data: existingVisits } = await existingVisitsQuery;

  const nextSortOrder =
    input.sort_order ??
    ((existingVisits?.[0]?.sort_order ?? -1) + 1);

  const { data: location, error: locationError } = await supabaseAdmin
    .from("locations")
    .insert({
      name: input.name,
      lat: input.lat,
      lng: input.lng,
      prefecture: input.prefecture ?? null,
      category_ids: input.category_ids ?? [],
    })
    .select("id")
    .single();

  if (locationError) throw new Error(locationError.message);

  const { data: visit, error: visitError } = await supabaseAdmin
    .from("visits")
    .insert({
      location_id: location.id,
      trip_id: input.trip_id ?? null,
      visited_at: input.visited_at ?? null,
      memo: input.memo ?? null,
      rating: input.rating ?? null,
      is_public: input.is_public ?? true,
      sort_order: nextSortOrder,
    })
    .select("id")
    .single();

  if (visitError) throw new Error(visitError.message);

  return { visitId: visit.id, locationId: location.id };
}

// ────────────────────────────────────────────
// Photo upload + record creation
// ────────────────────────────────────────────

export async function uploadPhotoFile(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const tripId = formData.get("trip_id") as string | null;

  if (!file || !tripId) throw new Error("Missing file or trip_id");

  const ext = "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const storagePath = `trips/${tripId}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("trip-photos")
    .upload(storagePath, buffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage
    .from("trip-photos")
    .getPublicUrl(storagePath);

  return { url: data.publicUrl };
}

export async function createPhotoRecord(input: {
  visit_id: string;
  url: string;
  caption?: string | null;
  sort_order?: number;
}) {
  await requireAdmin();

  // Get current max sort_order for this visit
  const { data: existingPhotos } = await supabaseAdmin
    .from("photos")
    .select("sort_order")
    .eq("visit_id", input.visit_id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder =
    input.sort_order ??
    ((existingPhotos?.[0]?.sort_order ?? -1) + 1);

  const { data, error } = await supabaseAdmin
    .from("photos")
    .insert({
      visit_id: input.visit_id,
      url: input.url,
      caption: input.caption ?? null,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
