import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moderatorRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const [updated] = await db.update(moderatorRules).set(body).where(eq(moderatorRules.id, id)).returning();
    return NextResponse.json({ success: true, rule: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.delete(moderatorRules).where(eq(moderatorRules.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
