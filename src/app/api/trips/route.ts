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
  const { id, title, started_at, ended_at, color, prefectures, companions, memo } = body;

  if (!id || !title || !started_at || !color) {
    return NextResponse.json({ error: "Missing required fields: id, title, started_at, color" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("trips")
    .insert({ id, title, started_at, ended_at: ended_at ?? null, color, prefectures: prefectures ?? null, companions: companions ?? null, memo: memo ?? null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
