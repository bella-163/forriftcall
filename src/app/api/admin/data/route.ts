import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "bella-163";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "forriftcall";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

async function isAuthed() {
  if (!ADMIN_PASSWORD) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin-token")?.value === ADMIN_PASSWORD;
}

async function writeToGitHub(key: string, data: unknown): Promise<void> {
  const filePath = `public/data/${key}.json`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };

  // Get current file SHA
  const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers });
  const sha = getRes.ok ? (await getRes.json()).sha : undefined;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Update ${key}.json via admin panel`,
      content,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "GitHub API error");
  }
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

  if (GITHUB_TOKEN) {
    try {
      await writeToGitHub(key, body);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  } else {
    writeData(key, body);
  }

  return NextResponse.json({ ok: true });
}
