type SectionPlaceholderProps = {
  title: string;
  description: string;
  items: string[];
};

export function SectionPlaceholder({ title, description, items }: SectionPlaceholderProps) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-20 lg:px-8">
      <p className="text-sm font-black tracking-[0.22em] text-rift-crimson">斷界召喚資料庫</p>
      <h1 className="mt-4 text-5xl font-black text-white">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/82">
            {item}
          </div>
        ))}
      </div>
    </main>
  );
}
