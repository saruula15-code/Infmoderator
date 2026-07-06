import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Unsigned upload preset mode — no API key/secret needed.
// Cloud name and preset name have safe defaults baked in, but can still be
// overridden via env vars if needed later.
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "erxwiiw1";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "moderator_preset";

const hasCloudinaryCreds = !!CLOUD_NAME && !!UPLOAD_PRESET;

if (hasCloudinaryCreds) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
  });
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB, matches the UI copy

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "moderators/misc";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File is too large. Maximum size is 10MB." }, { status: 400 });
    }

    // file.type can be an empty string for some mobile browsers/drag-drop sources.
    // Fall back to sniffing the extension so we don't send a malformed data URI.
    let mimeType = file.type;
    if (!mimeType) {
      const name = file.name?.toLowerCase() || "";
      if (name.endsWith(".png")) mimeType = "image/png";
      else if (name.endsWith(".jpg") || name.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (name.endsWith(".pdf")) mimeType = "application/pdf";
    }

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a JPG, PNG, or PDF." },
        { status: 400 }
      );
    }

    // No (or incomplete) Cloudinary credentials configured — return a mock URL
    // so local/dev/testing still works instead of silently failing uploads.
    if (!hasCloudinaryCreds) {
      await new Promise((r) => setTimeout(r, 500)); // simulate upload delay
      return NextResponse.json({
        url: `https://res.cloudinary.com/demo/image/upload/v1234567890/${folder}/dummy-${Date.now()}.jpg`,
      });
    }

    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${mimeType};base64,${base64String}`;

    const result = await cloudinary.uploader.unsigned_upload(dataURI, UPLOAD_PRESET, {
      folder,
      resource_type: mimeType === "application/pdf" ? "auto" : "image",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
