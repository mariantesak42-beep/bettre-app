"use client";

import { useState } from "react";
import { Check, ChevronDown, Clock, Copy, Link2, X } from "lucide-react";

type Witness = {
  id: string;
  userId: string | null;
  label: string | null;
  inviteToken: string;
  response: "PENDING" | "CONFIRMED_SUCCESS" | "CONFIRMED_FAILURE";
  user: { id: string; name: string } | null;
};

const RESPONSE_STYLES: Record<Witness["response"], string> = {
  PENDING: "bg-white text-ink",
  CONFIRMED_SUCCESS: "bg-lime-400 text-ink",
  CONFIRMED_FAILURE: "bg-red-600 text-white",
};

const RESPONSE_LABELS: Record<Witness["response"], string> = {
  PENDING: "Pending",
  CONFIRMED_SUCCESS: "Confirmed success",
  CONFIRMED_FAILURE: "Confirmed failure",
};

export default function WitnessRow({ witness, canInvite }: { witness: Witness; canInvite: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/invite/${witness.inviteToken}` : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — the link is still visible to copy manually
    }
  }

  const name = witness.user?.name ?? witness.label ?? "Unclaimed invite";

  return (
    <li className="pop-sm overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun-100 text-xs font-extrabold text-ink">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-bold text-ink">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-xs font-extrabold ${RESPONSE_STYLES[witness.response]}`}
          >
            {witness.response === "PENDING" && <Clock size={12} />}
            {witness.response === "CONFIRMED_SUCCESS" && <Check size={12} />}
            {witness.response === "CONFIRMED_FAILURE" && <X size={12} />}
            {RESPONSE_LABELS[witness.response]}
          </span>
          {canInvite && !witness.userId && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-xs font-extrabold text-ink hover:bg-sun-100"
            >
              <Link2 size={12} />
              Invite
              <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="flex items-center gap-2 border-t-2 border-ink bg-sun-50 px-3.5 py-2.5">
          <input
            readOnly
            value={inviteUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 truncate rounded-lg border-2 border-ink bg-white px-2 py-1.5 text-xs text-ink"
          />
          <button
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1 rounded-lg border-2 border-ink bg-ink px-2.5 py-1.5 text-xs font-extrabold text-white"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </li>
  );
}
