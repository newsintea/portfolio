import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { trip_id, name, lat, lng, prefecture, visited_at, memo, rating, is_public, sort_order } = body;

  if (!name || lat == null || lng == null) {
    return NextResponse.json({ error: "Missing required fields: name, lat, lng" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("places")
    .insert({
      trip_id: trip_id ?? null,
      name,
      lat,
      lng,
      prefecture: prefecture ?? null,
      visited_at: visited_at ?? null,
      memo: memo ?? null,
      rating: rating ?? null,
      is_public: is_public ?? true,
      sort_order: sort_order ?? 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
