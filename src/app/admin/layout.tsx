export const metadata = { title: "管理員面板 | 斷界召喚" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#09070d]">{children}</div>;
}
