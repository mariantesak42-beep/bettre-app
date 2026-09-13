"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Users, X } from "lucide-react";
import { CATEGORY_PRESETS, MIN_WITNESSES } from "@/lib/constants";
import CharityPicker, { type Charity } from "./CharityPicker";

function defaultDateInput(daysFromNow: number) {
  const d = new Date(Date.now() + daysFromNow * 86_400_000);
  return d.toISOString().slice(0, 16);
}

const SECTION_TINTS = {
  cerulean: { section: "bg-cerulean-50", chip: "bg-cerulean-600", chipText: "text-ink" },
  flamingo: { section: "bg-flamingo-50", chip: "bg-flamingo-500", chipText: "text-ink" },
  neutral: { section: "bg-stone-100", chip: "bg-ink", chipText: "text-white" },
} as const;

function FormSection({
  icon,
  title,
  tint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tint: keyof typeof SECTION_TINTS;
  children: React.ReactNode;
}) {
  const styles = SECTION_TINTS[tint];
  return (
    <section className={`rounded-2xl p-5 shadow-sm ${styles.section}`}>
      <div className="flex items-center gap-2 text-zinc-900">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.chipText} ${styles.chip}`}>
          {icon}
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default function NewBetForm() {
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [goalText, setGoalText] = useState("");
  const [category, setCategory] = useState(CATEGORY_PRESETS[0].label);
  const [goalKind, setGoalKind] = useState(CATEGORY_PRESETS[0].goalKind);
  const [stakeAmount, setStakeAmount] = useState(20);
  const [charityId, setCharityId] = useState("");
  const [startDate, setStartDate] = useState(defaultDateInput(0));
  const [endDate, setEndDate] = useState(defaultDateInput(30));
  const [isJournalPublic, setIsJournalPublic] = useState(false);
  const [witnesses, setWitnesses] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => {
        setCharities(data.charities ?? []);
        if (data.charities?.[0]) setCharityId(data.charities[0].id);
      });
  }, []);

  function handleCategoryChange(label: string) {
    setCategory(label);
    const preset = CATEGORY_PRESETS.find((p) => p.label === label);
    if (preset) setGoalKind(preset.goalKind);
  }

  function updateWitness(index: number, value: string) {
    setWitnesses((prev) => prev.map((w, i) => (i === index ? value : w)));
  }

  function addWitness() {
    setWitnesses((prev) => [...prev, ""]);
  }

  function removeWitness(index: number) {
    setWitnesses((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const labels = witnesses.map((w) => w.trim()).filter(Boolean);
    if (labels.length < MIN_WITNESSES) {
      setError(`Add at least ${MIN_WITNESSES} witnesses (a name or nickname for each).`);
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalText,
        category,
        goalKind,
        stakeAmount,
        charityId: charityId || null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isJournalPublic,
        witnesses: labels,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    const data = await res.json();
    router.push(`/bets/${data.bet.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <FormSection icon={<Target size={16} />} title="The goal" tint="cerulean">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          What are you committing to?
          <input
            type="text"
            required
            placeholder="e.g. No smoking for 30 days"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="rounded-lg border border-cerulean-200 bg-white px-3 py-2 text-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Category
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-lg border border-cerulean-200 bg-white px-3 py-2 text-zinc-900"
          >
            {CATEGORY_PRESETS.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-700">
          <span>How this bet gets verified:</span>
          <div className="flex rounded-full border border-cerulean-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setGoalKind("SUBJECTIVE")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                goalKind === "SUBJECTIVE" ? "bg-ink text-white" : "text-zinc-600"
              }`}
            >
              Self-reported
            </button>
            <button
              type="button"
              onClick={() => setGoalKind("OBJECTIVE")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                goalKind === "OBJECTIVE" ? "bg-cerulean-600 text-ink" : "text-zinc-600"
              }`}
            >
              Witness-verified
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Starts
            <input
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-cerulean-200 bg-white px-3 py-2 text-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Ends
            <input
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-cerulean-200 bg-white px-3 py-2 text-zinc-900"
            />
          </label>
        </div>
      </FormSection>

      <FormSection icon={<span className="text-base leading-none">€</span>} title="The stake" tint="flamingo">
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Stake
          <input
            type="number"
            min={0}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            className="rounded-lg border border-flamingo-200 bg-white px-3 py-2 text-zinc-900"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-zinc-700">
          If you fail, it goes to
          <CharityPicker charities={charities} value={charityId} onChange={setCharityId} />
        </div>
      </FormSection>

      <FormSection icon={<Users size={16} />} title="Witnesses" tint="neutral">
        <p className="text-sm text-zinc-700">
          Add at least {MIN_WITNESSES} people to keep you honest — you&apos;ll get a shareable
          invite link for each once the bet is created.
        </p>
        <div className="flex flex-col gap-2">
          {witnesses.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Witness ${i + 1} name or nickname`}
                value={w}
                onChange={(e) => updateWitness(i, e.target.value)}
                className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-zinc-900"
              />
              {witnesses.length > MIN_WITNESSES && (
                <button
                  type="button"
                  onClick={() => removeWitness(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/70 hover:text-zinc-600"
                  aria-label="Remove witness"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addWitness}
          className="self-start text-sm font-medium text-stone-700"
        >
          + Add another witness
        </button>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isJournalPublic}
            onChange={(e) => setIsJournalPublic(e.target.checked)}
          />
          Make my journal for this bet public
        </label>
      </FormSection>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-cerulean-600 px-4 py-2.5 font-medium text-ink shadow-sm hover:bg-cerulean-700 hover:text-white disabled:opacity-60"
      >
        {submitting ? "Creating bet…" : "Create bet"}
      </button>
    </form>
  );
}
