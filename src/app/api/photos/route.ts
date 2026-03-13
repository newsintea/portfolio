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
  const { visit_id, url, caption, sort_order } = body;

  if (!visit_id || !url) {
    return NextResponse.json({ error: "Missing required fields: visit_id, url" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("photos")
    .insert({
      visit_id,
      url,
      caption: caption ?? null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
