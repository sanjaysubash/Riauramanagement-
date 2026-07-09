import { NextResponse } from "next/server";
import { getCurrentUser, canSubmitOpsExpense } from "@/lib/auth";
import { getCloudinaryConfig, signCloudinaryUpload } from "@/lib/cloudinary";

// Same pattern as src/app/api/eod/upload/route.ts: the file goes straight to
// Cloudinary from the browser (signed via this route), and the OpsExpense
// row only ever stores the returned URL — the DB never sees the file's bytes.
export async function POST(): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user || !canSubmitOpsExpense(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cloudName, apiKey } = getCloudinaryConfig();
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `ops-expenses/${user.id}`;
    const signature = signCloudinaryUpload({ folder, timestamp });
    return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
