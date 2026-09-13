"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Coins, Flag, NotebookPen, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../../AuthContext";
import WitnessRow from "./WitnessRow";

type Witness = {
  id: string;
  userId: string | null;
  label: string | null;
  inviteToken: string;
  response: "PENDING" | "CONFIRMED_SUCCESS" | "CONFIRMED_FAILURE";
  user: { id: string; name: string } | null;
};

type Bet = {
  id: string;
  goalText: string;
  category: string | null;
  goalKind: "SUBJECTIVE" | "OBJECTIVE";
  stakeAmount: number;
  startDate: string;
  endDate: string;
  isJournalPublic: boolean;
  status: "ACTIVE" | "SUCCESS" | "FAILED" | "DISPUTED";
  owner: { id: string; name: string };
  charity: { id: string; name: string; logoUrl: string | null; websiteUrl: string | null } | null;
  witnesses: Witness[];
};

type JournalEntry = { id: string; content: string; createdAt: string };

const STATUS_BANNER: Record<Bet["status"], string> = {
  ACTIVE: "bg-sky-600",
  SUCCESS: "bg-emerald-600",
  FAILED: "bg-red-600",
  DISPUTED: "bg-amber-600",
};

function InfoPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white">
      {icon}
      {children}
    </span>
  );
}

export default function BetDetailClient({ betId }: { betId: string }) {
  const { user } = useAuth();
  const [bet, setBet] = useState<Bet | null>(null);
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBet = useCallback(async () => {
    const res = await fetch(`/api/bets/${betId}`);
    if (res.ok) setBet((await res.json()).bet);
  }, [betId]);

  const loadEntries = useCallback(async () => {
    const res = await fetch(`/api/bets/${betId}/journal-entries`);
    if (res.ok) {
      setEntries((await res.json()).entries);
      setJournalError(null);
    } else {
      setEntries(null);
      setJournalError((await res.json().catch(() => ({}))).error ?? "This journal is private.");
    }
  }, [betId]);

  useEffect(() => {
    loadBet();
    loadEntries();
  }, [loadBet, loadEntries]);

  if (!bet) return <p className="px-4 py-12 text-center text-zinc-500">Loading…</p>;

  const isOwner = user?.id === bet.owner.id;
  const myWitness = bet.witnesses.find((w) => w.userId === user?.id) ?? null;

  async function handleSelfReportFailure() {
    setActionError(null);
    const res = await fetch(`/api/bets/${betId}/self-report-failure`, { method: "POST" });
    if (!res.ok) {
      setActionError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      return;
    }
    loadBet();
  }

  async function handleRespond(response: "CONFIRMED_SUCCESS" | "CONFIRMED_FAILURE") {
    if (!myWitness) return;
    setActionError(null);
    const res = await fetch(`/api/witnesses/${myWitness.inviteToken}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });
    if (!res.ok) {
      setActionError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      return;
    }
    loadBet();
  }

  async function handleToggleJournal() {
    const res = await fetch(`/api/bets/${betId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isJournalPublic: !bet!.isJournalPublic }),
    });
    if (res.ok) {
      loadBet();
      loadEntries();
    }
  }

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!newEntry.trim()) return;
    const res = await fetch("/api/journal-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betId, content: newEntry.trim() }),
    });
    if (res.ok) {
      setNewEntry("");
      loadEntries();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className={`rounded-2xl p-6 text-white shadow-sm ${STATUS_BANNER[bet.status]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{bet.goalText}</h1>
            <p className="mt-1 text-sm text-white/80">
              by {bet.owner.name}
              {bet.category && ` · ${bet.category}`}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {bet.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <InfoPill icon={<ShieldCheck size={13} />}>
            {bet.goalKind === "OBJECTIVE" ? "Witness-verified" : "Self-reported"}
          </InfoPill>
          <InfoPill icon={<Coins size={13} />}>Stake: {bet.stakeAmount}</InfoPill>
          {bet.charity && (
            <InfoPill icon={<Flag size={13} />}>If failed: {bet.charity.name}</InfoPill>
          )}
          <InfoPill icon={<Calendar size={13} />}>
            {new Date(bet.startDate).toLocaleDateString()} – {new Date(bet.endDate).toLocaleDateString()}
          </InfoPill>
        </div>

        {actionError && <p className="mt-4 text-sm font-medium text-white">{actionError}</p>}

        {isOwner && bet.status === "ACTIVE" && (
          <button
            onClick={handleSelfReportFailure}
            className="mt-5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
          >
            I&apos;m giving up — mark as failed
          </button>
        )}

        {myWitness && bet.status === "ACTIVE" && (
          <div className="mt-5 rounded-xl bg-white p-4">
            <p className="text-sm font-medium text-zinc-800">You&apos;re a witness on this bet.</p>
            <p className="mt-1 text-sm text-zinc-600">
              Your current response: <strong>{myWitness.response}</strong>
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleRespond("CONFIRMED_SUCCESS")}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Confirm success
              </button>
              <button
                onClick={() => handleRespond("CONFIRMED_FAILURE")}
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm failure
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="mt-6">
        <div className="flex items-center gap-2 text-zinc-900">
          <Users size={16} />
          <h2 className="font-semibold">Witnesses</h2>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {bet.witnesses.map((w) => (
            <WitnessRow key={w.id} witness={w} canInvite={isOwner} />
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900">
            <NotebookPen size={16} />
            <h2 className="font-semibold">Journal</h2>
          </div>
          {isOwner && (
            <button onClick={handleToggleJournal} className="text-xs font-medium text-cerulean-700">
              Make {bet.isJournalPublic ? "private" : "public"}
            </button>
          )}
        </div>

        {isOwner && (
          <form onSubmit={handleAddEntry} className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="How's it going?"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900"
            >
              Post
            </button>
          </form>
        )}

        <div className="mt-3 flex flex-col gap-2">
          {entries === null && <p className="text-sm text-zinc-500">{journalError}</p>}
          {entries?.length === 0 && <p className="text-sm text-zinc-500">No entries yet.</p>}
          {entries?.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
              <p className="text-zinc-800">{entry.content}</p>
              <p className="mt-1 text-xs text-zinc-400">{new Date(entry.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
