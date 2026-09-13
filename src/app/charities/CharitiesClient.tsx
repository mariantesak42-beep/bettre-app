"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, HeartHandshake, Landmark } from "lucide-react";
import { CHARITY_CATEGORIES } from "@/lib/constants";

type Charity = {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

const CATEGORY_ACCENTS = ["bg-cerulean-600", "bg-flamingo-500", "bg-coral", "bg-gold", "bg-lime"];

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

  if (!charities) return <p className="px-4 py-12 text-center text-zinc-500">Loading…</p>;

  return (
    <div>
      <section className="bg-flamingo-500 text-ink">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
            <HeartHandshake size={22} />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Charities</h1>
          <p className="mx-auto mt-2 max-w-lg text-ink/70">
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
              className={`rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:opacity-90 ${CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}`}
            >
              {category}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-10">
          {byCategory.map(({ category, items }, i) => (
            <section key={category} id={slugify(category)} className="scroll-mt-20">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length]}`} />
                <h2 className="text-lg font-semibold text-zinc-900">{category}</h2>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                      {c.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <Landmark size={20} className="text-zinc-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-zinc-900">{c.name}</p>
                      <p className="mt-0.5 text-sm text-zinc-600">{c.description}</p>
                    </div>
                    {c.websiteUrl && (
                      <a
                        href={c.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1 self-center text-xs font-medium text-cerulean-700 hover:underline"
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
