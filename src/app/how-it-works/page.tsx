import Link from "next/link";
import { Target, Users, HeartHandshake, NotebookPen, ShieldCheck, Sparkles, ListChecks } from "lucide-react";
import Star from "../Star";

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

const STEP_ACCENTS = ["bg-lime-400", "bg-flamingo-400", "bg-sun-400"];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-lime-400 text-ink">
        <Star className="absolute -left-2 top-8 h-9 w-9 text-flamingo-500 rotate-12" />
        <Star className="absolute right-8 top-20 h-7 w-7 text-sun-500 -rotate-12" />
        <div className="relative mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-white/60">
            <ListChecks size={24} />
          </div>
          <h1 className="mt-4 font-heading text-4xl font-extrabold">How it works</h1>
          <p className="mx-auto mt-2 max-w-md font-medium text-ink/80">
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
              <li key={step.title} className="pop flex gap-4 bg-white p-5">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold text-ink ${accent}`}
                  >
                    {i + 1}
                  </div>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink text-ink ${accent}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-ink">{step.title}</h2>
                  <p className="mt-1 text-sm font-medium text-ink/70">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-sm font-medium text-ink/60">
          Changed your mind early? You can call it yourself — mark a bet failed anytime, no need to
          wait for the end date.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/signup" className="pop-btn bg-lime-400 px-6 py-2.5 font-extrabold text-ink">
            Make a bet
          </Link>
          <Link href="/charities" className="pop-btn bg-white px-6 py-2.5 font-extrabold text-ink">
            Browse charities
          </Link>
        </div>
      </div>
    </div>
  );
}
