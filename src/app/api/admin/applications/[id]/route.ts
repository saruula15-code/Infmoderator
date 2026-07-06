import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moderatorApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { status, adminNote } = await req.json();

    const [updated] = await db.update(moderatorApplications)
      .set({ status, adminNote, ...(adminNote !== undefined ? { adminNote } : {}) })
      .where(eq(moderatorApplications.id, id))
      .returning();

    return NextResponse.json({ success: true, application: updated });
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
    await db.delete(moderatorApplications).where(eq(moderatorApplications.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
