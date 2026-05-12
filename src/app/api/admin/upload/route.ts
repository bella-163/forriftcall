import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const ext = path.extname(file.name) || ".png";
  const safeName = `upload_${Date.now()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (GITHUB_TOKEN) {
    // 部署環境：透過 GitHub API 上傳圖片
    const filePath = `public/images/${safeName}`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `Upload image ${safeName} via admin panel`,
        content: buffer.toString("base64"),
        branch: GITHUB_BRANCH,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message ?? "GitHub 上傳失敗" }, { status: 500 });
    }

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/images/${safeName}`;
    return NextResponse.json({ url: rawUrl });
  } else {
    // 本地開發：直接寫入 public/images/
    const destPath = path.join(process.cwd(), "public", "images", safeName);
    try {
      fs.writeFileSync(destPath, buffer);
    } catch {
      return NextResponse.json({ error: "寫入檔案失敗，請確認 public/images 目錄存在" }, { status: 500 });
    }
    return NextResponse.json({ url: `/images/${safeName}` });
  }
}
