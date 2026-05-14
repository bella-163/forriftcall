import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "public", "data");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "bella-163";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "forriftcall";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

function dataPath(key: string) {
  return `public/data/${key}.json`;
}

export function readData<T>(key: string): T {
  const filePath = path.join(dataDir, `${key}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function readRuntimeData<T>(key: string): Promise<T> {
  if (!GITHUB_TOKEN) return readData<T>(key);

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dataPath(key)}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw",
    },
  });

  if (!res.ok) throw new Error(`Unable to read ${key}.json from GitHub`);
  return JSON.parse(await res.text()) as T;
}

export function writeData(key: string, data: unknown): void {
  const filePath = path.join(dataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeRuntimeData(key: string, data: unknown): Promise<void> {
  if (!GITHUB_TOKEN) {
    writeData(key, data);
    return;
  }

  const filePath = dataPath(key);
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };

  const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { cache: "no-store", headers });
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
