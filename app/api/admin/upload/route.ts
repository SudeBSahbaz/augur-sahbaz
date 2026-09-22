import { NextResponse } from "next/server";
import { getAdminConfig, getAdminSession } from "@/lib/admin-auth";

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function POST(request: Request) {
  const config = getAdminConfig();
  const session = await getAdminSession();

  if (!config || !session.authenticated) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Dosya boyutu en fazla 4 MB olabilir." },
      { status: 400 }
    );
  }

  const fileName = safeFileName(file.name || "dosya");
  const objectPath = `posts/${new Date().getFullYear()}/${crypto.randomUUID()}-${fileName}`;
  const bytes = await file.arrayBuffer();

  const uploadResponse = await fetch(
    `${config.url}/storage/v1/object/feed-assets/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: bytes,
      cache: "no-store",
    }
  );

  if (!uploadResponse.ok) {
    return NextResponse.json(
      { error: await uploadResponse.text() },
      { status: 400 }
    );
  }

  const publicUrl = `${config.url}/storage/v1/object/public/feed-assets/${objectPath}`;

  return NextResponse.json({
    url: publicUrl,
    name: file.name,
    type: file.type,
    size: file.size,
  });
}
