"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FeedBet = {
  id: string;
  goalText: string;
  category: string | null;
  status: "ACTIVE" | "SUCCESS" | "FAILED" | "DISPUTED";
  endDate: string;
  owner: { name: string };
  charity: { name: string } | null;
};

const STATUS_STYLES: Record<FeedBet["status"], string> = {
  ACTIVE: "bg-blue-600 text-white",
  SUCCESS: "bg-lime-500 text-ink",
  FAILED: "bg-red-600 text-white",
  DISPUTED: "bg-sun-400 text-ink",
};

export default function FeedClient() {
  const [bets, setBets] = useState<FeedBet[] | null>(null);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => setBets(data.bets));
  }, []);

  if (bets === null) return <p className="px-4 py-12 text-center font-bold text-ink/50">Loading…</p>;
  if (bets.length === 0) return <p className="px-4 py-12 text-center font-bold text-ink/50">No bets yet.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-3xl font-extrabold text-ink">Feed</h1>
      <ul className="mt-6 flex flex-col gap-3">
        {bets.map((bet) => (
          <li key={bet.id}>
            <Link
              href={`/bets/${bet.id}`}
              className="pop-row flex items-center justify-between gap-4 bg-white px-4 py-3"
            >
              <div>
                <p className="font-bold text-ink">{bet.goalText}</p>
                <p className="mt-0.5 text-sm font-medium text-ink/60">
                  {bet.owner.name}
                  {bet.category && ` · ${bet.category}`}
                  {bet.charity && ` · ${bet.charity.name} if failed`}
                </p>
              </div>
              <span className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold ${STATUS_STYLES[bet.status]}`}>
                {bet.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
