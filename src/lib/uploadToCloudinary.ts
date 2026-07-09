// Client-side helper: asks our server for a signed Cloudinary upload (so the
// api_secret never reaches the browser), then uploads the file straight to
// Cloudinary. The DB only ever stores the returned secure_url, same pattern
// the old Vercel Blob integration used.
export type CloudinaryUploadResult = { url: string; name: string; size: number; type: string };

export async function uploadToCloudinary(
  file: File,
  signUrl: string,
  extra: Record<string, string> = {}
): Promise<CloudinaryUploadResult> {
  const signRes = await fetch(signUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(extra),
  });
  if (!signRes.ok) {
    const body = await signRes.json().catch(() => ({}));
    throw new Error(body.error || "Could not get upload authorization.");
  }
  const { cloudName, apiKey, timestamp, folder, signature } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed.");
  const data = await uploadRes.json();
  return { url: data.secure_url as string, name: file.name, size: file.size, type: file.type };
}
