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
  ACTIVE: "bg-blue-600",
  SUCCESS: "bg-lime-500",
  FAILED: "bg-red-600",
  DISPUTED: "bg-sun-400",
};

const STATUS_TEXT: Record<Bet["status"], string> = {
  ACTIVE: "text-white",
  SUCCESS: "text-ink",
  FAILED: "text-white",
  DISPUTED: "text-ink",
};

function InfoPill({ icon, dark, children }: { icon: React.ReactNode; dark: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-extrabold ${
        dark ? "border-white/40 bg-white/15 text-white" : "border-ink/25 bg-ink/10 text-ink"
      }`}
    >
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

  if (!bet) return <p className="px-4 py-12 text-center font-bold text-ink/50">Loading…</p>;

  const isOwner = user?.id === bet.owner.id;
  const myWitness = bet.witnesses.find((w) => w.userId === user?.id) ?? null;
  const dark = STATUS_TEXT[bet.status] === "text-white";

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
      <div className={`pop p-6 ${STATUS_TEXT[bet.status]} ${STATUS_BANNER[bet.status]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold">{bet.goalText}</h1>
            <p className={`mt-1 text-sm font-bold ${dark ? "text-white/80" : "text-ink/70"}`}>
              by {bet.owner.name}
              {bet.category && ` · ${bet.category}`}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border-2 px-3 py-1 text-xs font-extrabold ${
              dark ? "border-white/40 bg-white/20" : "border-ink/25 bg-ink/10"
            }`}
          >
            {bet.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <InfoPill icon={<ShieldCheck size={13} />} dark={dark}>
            {bet.goalKind === "OBJECTIVE" ? "Witness-verified" : "Self-reported"}
          </InfoPill>
          <InfoPill icon={<Coins size={13} />} dark={dark}>Stake: {bet.stakeAmount}</InfoPill>
          {bet.charity && (
            <InfoPill icon={<Flag size={13} />} dark={dark}>If failed: {bet.charity.name}</InfoPill>
          )}
          <InfoPill icon={<Calendar size={13} />} dark={dark}>
            {new Date(bet.startDate).toLocaleDateString()} – {new Date(bet.endDate).toLocaleDateString()}
          </InfoPill>
        </div>

        {actionError && <p className={`mt-4 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>{actionError}</p>}

        {isOwner && bet.status === "ACTIVE" && (
          <button
            onClick={handleSelfReportFailure}
            className={`pop-btn mt-5 px-4 py-2 text-sm font-extrabold ${dark ? "bg-white/15 text-white" : "bg-white/60 text-ink"}`}
          >
            I&apos;m giving up — mark as failed
          </button>
        )}

        {myWitness && bet.status === "ACTIVE" && (
          <div className="pop-sm mt-5 bg-white p-4">
            <p className="text-sm font-bold text-ink">You&apos;re a witness on this bet.</p>
            <p className="mt-1 text-sm font-medium text-ink/70">
              Your current response: <strong>{myWitness.response}</strong>
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleRespond("CONFIRMED_SUCCESS")}
                className="pop-btn bg-lime-500 px-4 py-1.5 text-sm font-extrabold text-ink"
              >
                Confirm success
              </button>
              <button
                onClick={() => handleRespond("CONFIRMED_FAILURE")}
                className="pop-btn bg-red-600 px-4 py-1.5 text-sm font-extrabold text-white"
              >
                Confirm failure
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2 text-ink">
          <Users size={16} />
          <h2 className="font-heading font-extrabold">Witnesses</h2>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {bet.witnesses.map((w) => (
            <WitnessRow key={w.id} witness={w} canInvite={isOwner} />
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink">
            <NotebookPen size={16} />
            <h2 className="font-heading font-extrabold">Journal</h2>
          </div>
          {isOwner && (
            <button onClick={handleToggleJournal} className="text-xs font-extrabold text-flamingo-700">
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
              className="pop-sm flex-1 bg-white px-3 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" className="pop-btn bg-ink px-4 py-2 text-sm font-extrabold text-white">
              Post
            </button>
          </form>
        )}

        <div className="mt-3 flex flex-col gap-2">
          {entries === null && <p className="text-sm font-medium text-ink/50">{journalError}</p>}
          {entries?.length === 0 && <p className="text-sm font-medium text-ink/50">No entries yet.</p>}
          {entries?.map((entry) => (
            <div key={entry.id} className="pop-sm bg-white px-3 py-2 text-sm">
              <p className="text-ink">{entry.content}</p>
              <p className="mt-1 text-xs font-medium text-ink/40">{new Date(entry.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
