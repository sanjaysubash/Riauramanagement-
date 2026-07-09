import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCloudinaryConfig, signCloudinaryUpload } from "@/lib/cloudinary";

// Files never touch the database — they go straight to Cloudinary from the
// browser (signed via this route), and the EOD record only ever stores the
// returned URL + metadata (see prisma/schema.prisma EODReport.attachments).
// This is what keeps uploads from bloating the Turso/SQLite DB: the DB size
// grows by ~200 bytes of JSON per attachment, not by the file's actual size.
const MAX_FILES_PER_REPORT = 5;

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const existingCount = Number(body.existingCount) || 0;
  if (existingCount >= MAX_FILES_PER_REPORT) {
    return NextResponse.json(
      { error: `You can attach at most ${MAX_FILES_PER_REPORT} files to a single EOD report.` },
      { status: 400 }
    );
  }

  try {
    const { cloudName, apiKey } = getCloudinaryConfig();
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `eod/${user.id}`;
    const signature = signCloudinaryUpload({ folder, timestamp });
    return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
