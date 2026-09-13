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
  ACTIVE: "bg-blue-100 text-blue-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  DISPUTED: "bg-amber-100 text-amber-800",
};

const STATUS_BORDER: Record<FeedBet["status"], string> = {
  ACTIVE: "border-l-blue-400",
  SUCCESS: "border-l-emerald-500",
  FAILED: "border-l-red-400",
  DISPUTED: "border-l-amber-400",
};

export default function FeedClient() {
  const [bets, setBets] = useState<FeedBet[] | null>(null);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => setBets(data.bets));
  }, []);

  if (bets === null) return <p className="px-4 py-12 text-center text-zinc-500">Loading…</p>;
  if (bets.length === 0) return <p className="px-4 py-12 text-center text-zinc-500">No bets yet.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">Feed</h1>
      <ul className="mt-6 flex flex-col gap-3">
        {bets.map((bet) => (
          <li key={bet.id}>
            <Link
              href={`/bets/${bet.id}`}
              className={`flex items-center justify-between gap-4 rounded-xl border-l-4 bg-white px-4 py-3 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${STATUS_BORDER[bet.status]}`}
            >
              <div>
                <p className="font-medium text-zinc-900">{bet.goalText}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {bet.owner.name}
                  {bet.category && ` · ${bet.category}`}
                  {bet.charity && ` · ${bet.charity.name} if failed`}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[bet.status]}`}>
                {bet.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
