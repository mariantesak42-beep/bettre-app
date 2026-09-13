"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Trophy, Target, ChevronRight } from "lucide-react";

type Bet = {
  id: string;
  goalText: string;
  category: string | null;
  status: "ACTIVE" | "SUCCESS" | "FAILED" | "DISPUTED";
  endDate: string;
};

type DashboardData = {
  activeBets: Bet[];
  historyBets: Bet[];
  stats: { successCount: number; failedCount: number; successRate: number | null; streak: number };
};

const STATUS_STYLES: Record<Bet["status"], string> = {
  ACTIVE: "bg-blue-100 text-blue-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  DISPUTED: "bg-amber-100 text-amber-800",
};

const STATUS_BORDER: Record<Bet["status"], string> = {
  ACTIVE: "border-l-blue-400",
  SUCCESS: "border-l-emerald-500",
  FAILED: "border-l-red-400",
  DISPUTED: "border-l-amber-400",
};

function StatCard({
  icon,
  value,
  label,
  bg,
  dark,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bg: string;
  dark?: boolean;
}) {
  const text = dark ? "text-white" : "text-ink";
  const chipBg = dark ? "bg-white/10" : "bg-white/40";
  const subText = dark ? "text-white/70" : "text-ink/70";
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${text} ${bg}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${chipBg}`}>{icon}</div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className={`text-xs ${subText}`}>{label}</p>
    </div>
  );
}

function BetRow({ bet }: { bet: Bet }) {
  return (
    <Link
      href={`/bets/${bet.id}`}
      className={`group flex items-center justify-between gap-4 rounded-xl border-l-4 bg-white px-4 py-3 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${STATUS_BORDER[bet.status]}`}
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900">{bet.goalText}</p>
        <p className="mt-0.5 text-sm text-zinc-500">
          Ends {new Date(bet.endDate).toLocaleDateString()}
          {bet.category && ` · ${bet.category}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[bet.status]}`}>
          {bet.status}
        </span>
        <ChevronRight size={16} className="text-zinc-300 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="px-4 py-12 text-center text-zinc-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">My Bets</h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard
          icon={<Flame size={18} />}
          bg="bg-flamingo-500"
          value={data.stats.streak}
          label="current streak"
        />
        <StatCard
          icon={<Trophy size={18} />}
          bg="bg-cerulean-600"
          value={data.stats.successRate === null ? "—" : `${Math.round(data.stats.successRate * 100)}%`}
          label="success rate"
        />
        <StatCard
          icon={<Target size={18} />}
          bg="bg-ink"
          dark
          value={`${data.stats.successCount} / ${data.stats.successCount + data.stats.failedCount}`}
          label="bets won"
        />
      </div>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-800">Active bets</h2>
        <div className="mt-3 flex flex-col gap-2">
          {data.activeBets.length === 0 && (
            <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
              No active bets right now.
            </p>
          )}
          {data.activeBets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-800">History</h2>
        <div className="mt-3 flex flex-col gap-2">
          {data.historyBets.length === 0 && (
            <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
              No resolved bets yet.
            </p>
          )}
          {data.historyBets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
        </div>
      </section>
    </div>
  );
}
