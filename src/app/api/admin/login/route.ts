import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check this authenticated user is allowed into the admin panel
    const [adminRow] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, data.user.id));

    if (!adminRow) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
    }

    // Supabase SSR client already set the session cookies on the response
    // via cookies() inside createSupabaseServerClient.
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
