import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moderatorRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, description, orderIndex } = await req.json();
    const [inserted] = await db.insert(moderatorRules).values({ title, description, orderIndex }).returning();
    return NextResponse.json({ success: true, rule: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Bulk reorder or update
  return NextResponse.json({ success: true });
}
