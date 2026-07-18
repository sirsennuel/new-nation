import Image from 'next/image';

export function ProductCard({ p }: { p: { id: string; slug: string; name: string; category: string; price: number; image: string } }) {
  return (
    <a href={`/product/${p.slug}`} className="group">
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#ececea] relative">
        <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-[var(--ink-4)] uppercase tracking-[0.18em]">{p.category}</div>
          <div className="font-semibold mt-1 truncate">{p.name}</div>
        </div>
        <div className="text-sm font-semibold text-[var(--accent)] whitespace-nowrap">${(p.price / 100).toFixed(2)}</div>
      </div>
    </a>
  );
}
