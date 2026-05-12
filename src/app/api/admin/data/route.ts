import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function isAuthed() {
  if (!ADMIN_PASSWORD) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin-token")?.value === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });
  try {
    const data = readData(key);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });
  const body = await req.json();
  writeData(key, body);
  return NextResponse.json({ ok: true });
}
