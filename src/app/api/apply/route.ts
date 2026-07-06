import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moderatorApplications } from "@/db/schema";
import { z } from "zod";

const applySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  facebookLink: z.string().url("Invalid URL"),
  address: z.string().min(1, "Address is required"),
  parentPhone: z.string().optional(),
  parentFacebook: z.string().optional(),
  schoolName: z.string().optional(),
  className: z.string().optional(),
  teacherName: z.string().optional(),
  teacherPhone: z.string().optional(),
  teacherFacebook: z.string().optional(),
  idDocumentUrl: z.string().min(1, "ID Document is required"),
  facePhotoUrl: z.string().min(1, "Face Photo is required"),
  verificationMethod: z.string().min(1, "Verification method is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = applySchema.parse(body);

    const [inserted] = await db.insert(moderatorApplications).values({
      ...data,
      status: "Pending",
    }).returning();

    return NextResponse.json({ success: true, application: inserted });
  } catch (error: any) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
