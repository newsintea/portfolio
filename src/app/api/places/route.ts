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
  const { trip_id, name, lat, lng, prefecture, visited_at, memo, rating, is_public, sort_order, categories } = body;

  if (!name || lat == null || lng == null) {
    return NextResponse.json({ error: "Missing required fields: name, lat, lng" }, { status: 400 });
  }

  // カテゴリ名 → UUID 解決
  let category_ids: string[] = [];
  if (categories && categories.length > 0) {
    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .in("name", categories);
    category_ids = (cats ?? []).map((c: { id: string }) => c.id);
  }

  // location 作成
  const { data: location, error: locationError } = await supabaseAdmin
    .from("locations")
    .insert({ name, lat, lng, prefecture: prefecture ?? null, category_ids })
    .select("id")
    .single();

  if (locationError) {
    return NextResponse.json({ error: locationError.message }, { status: 500 });
  }

  // visit 作成
  const { data: visit, error: visitError } = await supabaseAdmin
    .from("visits")
    .insert({
      location_id: location.id,
      trip_id: trip_id ?? null,
      visited_at: visited_at ?? null,
      memo: memo ?? null,
      rating: rating ?? null,
      is_public: is_public ?? true,
      sort_order: sort_order ?? 0,
    })
    .select("id")
    .single();

  if (visitError) {
    return NextResponse.json({ error: visitError.message }, { status: 500 });
  }

  return NextResponse.json({ id: visit.id, location_id: location.id }, { status: 201 });
}
