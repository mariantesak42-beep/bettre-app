"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, HeartHandshake, Landmark } from "lucide-react";
import { CHARITY_CATEGORIES } from "@/lib/constants";
import Star from "../Star";

type Charity = {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

const CATEGORY_ACCENTS = ["bg-lime-400", "bg-flamingo-400", "bg-sun-400"];

export default function CharitiesClient() {
  const [charities, setCharities] = useState<Charity[] | null>(null);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data.charities ?? []));
  }, []);

  const byCategory = useMemo(() => {
    if (!charities) return [];
    const order = [...CHARITY_CATEGORIES] as string[];
    const groups = new Map<string, Charity[]>();
    for (const c of charities) {
      if (!groups.has(c.category)) groups.set(c.category, []);
      groups.get(c.category)!.push(c);
    }
    const extraCategories = [...groups.keys()].filter((c) => !order.includes(c)).sort();
    return [...order, ...extraCategories]
      .filter((cat) => groups.has(cat))
      .map((cat) => ({ category: cat, items: groups.get(cat)! }));
  }, [charities]);

  if (!charities) return <p className="px-4 py-12 text-center font-bold text-ink/50">Loading…</p>;

  return (
    <div>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-flamingo-400 text-ink">
        <Star className="absolute -left-3 top-6 h-10 w-10 text-sun-400 -rotate-12" />
        <Star className="absolute right-6 top-16 h-7 w-7 text-lime-500 rotate-12" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-white/60">
            <HeartHandshake size={24} />
          </div>
          <h1 className="mt-4 font-heading text-4xl font-extrabold">Charities</h1>
          <p className="mx-auto mt-2 max-w-lg font-medium text-ink/80">
            These are the causes you can back a bet with. Fail your goal, and your stake goes to
            the one you picked.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav className="flex flex-wrap gap-2">
          {byCategory.map(({ category }, i) => (
            <a
              key={category}
              href={`#${slugify(category)}`}
              className={`pop-btn px-3.5 py-1.5 text-xs font-extrabold text-ink ${CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}`}
            >
              {category}
            </a>
          ))}
        </nav>

        <div className="mt-9 flex flex-col gap-10">
          {byCategory.map(({ category, items }, i) => (
            <section key={category} id={slugify(category)} className="scroll-mt-20">
              <div className="flex items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}`} />
                <h2 className="font-heading text-xl font-extrabold text-ink">{category}</h2>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {items.map((c) => (
                  <div key={c.id} className="pop-row flex items-start gap-4 bg-white p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-white">
                      {c.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <Landmark size={20} className="text-ink/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink">{c.name}</p>
                      <p className="mt-0.5 text-sm font-medium text-ink/70">{c.description}</p>
                    </div>
                    {c.websiteUrl && (
                      <a
                        href={c.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1 self-center text-xs font-extrabold text-flamingo-700 hover:underline"
                      >
                        Visit
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
