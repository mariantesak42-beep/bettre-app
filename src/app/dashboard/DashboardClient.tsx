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
  ACTIVE: "bg-blue-600 text-white",
  SUCCESS: "bg-lime-500 text-ink",
  FAILED: "bg-red-600 text-white",
  DISPUTED: "bg-sun-400 text-ink",
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
  const chipBg = dark ? "bg-white/15" : "bg-white/50";
  const subText = dark ? "text-white/75" : "text-ink/75";
  return (
    <div className={`pop p-4 ${text} ${bg}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink ${chipBg}`}>
        {icon}
      </div>
      <p className="mt-3 font-heading text-2xl font-extrabold">{value}</p>
      <p className={`text-xs font-bold ${subText}`}>{label}</p>
    </div>
  );
}

function BetRow({ bet }: { bet: Bet }) {
  return (
    <Link
      href={`/bets/${bet.id}`}
      className="pop-row group flex items-center justify-between gap-4 bg-white px-4 py-3"
    >
      <div className="min-w-0">
        <p className="truncate font-bold text-ink">{bet.goalText}</p>
        <p className="mt-0.5 text-sm font-medium text-ink/60">
          Ends {new Date(bet.endDate).toLocaleDateString()}
          {bet.category && ` · ${bet.category}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold ${STATUS_STYLES[bet.status]}`}>
          {bet.status}
        </span>
        <ChevronRight size={16} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
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

  if (!data) return <p className="px-4 py-12 text-center font-bold text-ink/50">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-3xl font-extrabold text-ink">My Bets</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard
          icon={<Flame size={18} />}
          bg="bg-flamingo-400"
          value={data.stats.streak}
          label="current streak"
        />
        <StatCard
          icon={<Trophy size={18} />}
          bg="bg-sun-400"
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

      <section className="mt-9">
        <h2 className="font-heading text-lg font-extrabold text-ink">Active bets</h2>
        <div className="mt-3 flex flex-col gap-3">
          {data.activeBets.length === 0 && (
            <p className="rounded-2xl border-2 border-dashed border-ink/30 px-4 py-6 text-center text-sm font-medium text-ink/50">
              No active bets right now.
            </p>
          )}
          {data.activeBets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-heading text-lg font-extrabold text-ink">History</h2>
        <div className="mt-3 flex flex-col gap-3">
          {data.historyBets.length === 0 && (
            <p className="rounded-2xl border-2 border-dashed border-ink/30 px-4 py-6 text-center text-sm font-medium text-ink/50">
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
