"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../AuthContext";

type WitnessInvite = {
  id: string;
  userId: string | null;
  label: string | null;
  bet: {
    id: string;
    goalText: string;
    endDate: string;
    owner: { id: string; name: string };
  };
  user: { id: string; name: string } | null;
};

export default function InviteClaimClient({ token }: { token: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [invite, setInvite] = useState<WitnessInvite | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/witnesses/${token}`);
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    setInvite((await res.json()).witness);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClaim() {
    setClaiming(true);
    setError(null);
    const res = await fetch(`/api/witnesses/${token}/claim`, { method: "POST" });
    setClaiming(false);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      return;
    }
    const data = await res.json();
    router.push(`/bets/${data.witness.betId ?? invite?.bet.id}`);
  }

  if (notFound) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-zinc-600">Invite not found.</p>;
  }
  if (!invite) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-zinc-500">Loading…</p>;
  }

  const alreadyClaimedByMe = invite.userId && invite.userId === user?.id;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">You&apos;ve been asked to be a witness</h1>
      <p className="mt-3 text-zinc-600">
        {invite.bet.owner.name} is betting on: <strong>{invite.bet.goalText}</strong>
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        Ends {new Date(invite.bet.endDate).toLocaleDateString()}
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {alreadyClaimedByMe ? (
        <Link
          href={`/bets/${invite.bet.id}`}
          className="mt-6 inline-block rounded-full bg-cerulean-600 px-6 py-2.5 font-medium text-ink hover:bg-cerulean-700 hover:text-white"
        >
          View the bet
        </Link>
      ) : invite.userId ? (
        <p className="mt-6 text-sm text-zinc-500">This invite has already been claimed by someone else.</p>
      ) : authLoading ? null : user ? (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="mt-6 rounded-full bg-cerulean-600 px-6 py-2.5 font-medium text-ink hover:bg-cerulean-700 hover:text-white disabled:opacity-60"
        >
          {claiming ? "Joining…" : "Become a witness"}
        </button>
      ) : (
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/signup?next=/invite/${token}`}
            className="rounded-full bg-cerulean-600 px-6 py-2.5 font-medium text-ink hover:bg-cerulean-700 hover:text-white"
          >
            Sign up
          </Link>
          <Link
            href={`/login?next=/invite/${token}`}
            className="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
