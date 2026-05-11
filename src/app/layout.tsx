import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "斷界召喚｜Minecraft RPG 伺服器攻略站",
  description: "斷界召喚玩家專用攻略站，收錄職業、裝備、怪物、功能指令與副本攻略。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
