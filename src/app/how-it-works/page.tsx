import Link from "next/link";
import { Target, Users, HeartHandshake, NotebookPen, ShieldCheck, Sparkles, ListChecks } from "lucide-react";

const STEPS = [
  {
    icon: Target,
    title: "Set a goal and a stake",
    description:
      "Pick what you're committing to, how long you've got, and a symbolic amount you're putting on the line.",
  },
  {
    icon: Users,
    title: "Add at least 2 witnesses",
    description:
      "Invite people who'll vouch for whether you actually pulled it off. They get a link — no account needed just to view it.",
  },
  {
    icon: HeartHandshake,
    title: "Pick a charity",
    description: "Choose where your stake goes if you don't follow through.",
  },
  {
    icon: NotebookPen,
    title: "Do the thing — journal it if you want",
    description:
      "Log your progress along the way. Make it public for extra pressure, or keep it just for you.",
  },
  {
    icon: ShieldCheck,
    title: "Your witnesses decide",
    description:
      "When the bet ends, each witness confirms success or failure. One \"failed\" beats any number of \"succeeded\" — and if someone goes quiet, the benefit of the doubt goes to the charity, not you.",
  },
  {
    icon: Sparkles,
    title: "Either way, something gets Bettre",
    description:
      "Pull it off, and you keep your win and your streak. Don't, and your stake still does some good.",
  },
];

const STEP_ACCENTS = ["bg-cerulean-600", "bg-flamingo-500", "bg-coral", "bg-gold", "bg-lime"];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-cerulean-600 text-ink">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
            <ListChecks size={22} />
          </div>
          <h1 className="mt-4 text-3xl font-bold">How it works</h1>
          <p className="mx-auto mt-2 max-w-md text-ink/70">
            Bettre yourself or Bettre the world — here&apos;s the mechanic behind it, step by step.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const accent = STEP_ACCENTS[i % STEP_ACCENTS.length];
            return (
              <li key={step.title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-ink ${accent}`}
                  >
                    {i + 1}
                  </div>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-ink ${accent}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-900">{step.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-sm text-zinc-500">
          Changed your mind early? You can call it yourself — mark a bet failed anytime, no need to
          wait for the end date.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-cerulean-600 px-6 py-2.5 font-medium text-ink shadow-sm hover:bg-cerulean-700 hover:text-white"
          >
            Make a bet
          </Link>
          <Link
            href="/charities"
            className="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Browse charities
          </Link>
        </div>
      </div>
    </div>
  );
}
