import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "public", "data");

export function readData<T>(key: string): T {
  const filePath = path.join(dataDir, `${key}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeData(key: string, data: unknown): void {
  const filePath = path.join(dataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
