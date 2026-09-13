"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Landmark } from "lucide-react";
import { CHARITY_CATEGORIES } from "@/lib/constants";

export type Charity = {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

export default function CharityPicker({
  charities,
  value,
  onChange,
}: {
  charities: Charity[];
  value: string;
  onChange: (id: string) => void;
}) {
  const categories = useMemo(() => {
    const order = [...CHARITY_CATEGORIES] as string[];
    const present = new Set(charities.map((c) => c.category));
    const extra = [...present].filter((c) => !order.includes(c)).sort();
    return [...order, ...extra].filter((c) => present.has(c));
  }, [charities]);

  const selected = charities.find((c) => c.id === value) ?? null;
  const [category, setCategory] = useState<string>("");

  // charities/value load asynchronously after mount — (re)sync the category
  // filter once real data arrives, or if it ever points at a category with
  // no charities left in it.
  useEffect(() => {
    if (charities.length === 0) return;
    if (category && charities.some((c) => c.category === category)) return;
    setCategory(selected?.category ?? charities[0].category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charities, selected, category]);

  const filtered = charities.filter((c) => c.category === category);

  function handleCategoryChange(next: string) {
    setCategory(next);
    const first = charities.find((c) => c.category === next);
    if (first) onChange(first.id);
  }

  if (charities.length === 0) {
    return <p className="text-sm font-medium text-ink/60">Loading charities…</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink outline-none"
        >
          {filtered.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-white px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-ink bg-white">
            {selected.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <Landmark size={14} className="text-ink/40" />
            )}
          </div>
          <p className="line-clamp-2 text-xs font-medium text-ink/70">{selected.description}</p>
        </div>
      )}

      <a
        href="/charities"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-1 text-xs font-extrabold text-flamingo-700 hover:underline"
      >
        See all charities & learn more
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
