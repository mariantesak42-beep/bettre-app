"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, HeartHandshake, NotebookPen, Sparkles } from "lucide-react";
import Star from "./Star";
import { useAuth } from "./AuthContext";

export default function Home() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [startingDemo, setStartingDemo] = useState(false);

  async function handleTryDemo() {
    setStartingDemo(true);
    const res = await fetch("/api/auth/guest", { method: "POST" });
    if (!res.ok) {
      setStartingDemo(false);
      return;
    }
    await refresh();
    router.push("/bets/new");
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-sun-400 text-ink">
        <Star className="absolute -left-2 top-10 h-14 w-14 text-flamingo-500 -rotate-12 sm:left-8" />
        <Star className="absolute right-4 top-24 h-9 w-9 text-lime-500 rotate-12 sm:right-16" />
        <Star className="absolute bottom-8 left-1/4 h-7 w-7 text-flamingo-500 rotate-45" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-heading text-6xl font-extrabold tracking-tight sm:text-7xl">Bettre</h1>
          <p className="mx-auto mt-4 max-w-lg text-xl font-bold text-flamingo-700">
            Bettre yourself or Bettre the world.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base font-medium text-ink/80">
            Set a goal and put something on the line. Pull the bet off, and you win. Don&apos;t, and
            your stake goes straight to a cause you chose in advance.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-xl font-extrabold text-ink">
            There&apos;s no losing move — either you get better, or the world does.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <button
              onClick={handleTryDemo}
              disabled={startingDemo}
              className="pop-btn flex items-center gap-2 bg-flamingo-500 px-7 py-3 text-lg font-extrabold text-ink disabled:opacity-60"
            >
              <Sparkles size={20} />
              {startingDemo ? "Setting up…" : "Try it now — no signup"}
            </button>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/signup" className="font-bold text-ink/70 underline underline-offset-2 hover:text-ink">
                Make a real account
              </Link>
              <span className="text-ink/40">·</span>
              <Link href="/feed" className="font-bold text-ink/70 underline underline-offset-2 hover:text-ink">
                See the feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="grid gap-6 text-left sm:grid-cols-3">
          <div className="pop bg-lime-400 p-6 text-ink">
            <Users size={34} strokeWidth={2.25} />
            <h2 className="mt-3 font-heading text-xl font-extrabold">Witnesses</h2>
            <p className="mt-1.5 text-sm font-medium text-ink/80">
              At least two people confirm whether you actually pulled it off.
            </p>
          </div>
          <div className="pop bg-flamingo-400 p-6 text-ink">
            <HeartHandshake size={34} strokeWidth={2.25} />
            <h2 className="mt-3 font-heading text-xl font-extrabold">Charity stake</h2>
            <p className="mt-1.5 text-sm font-medium text-ink/80">
              Fail, and your stake goes to a cause you picked — so even a loss does some good.
            </p>
          </div>
          <div className="pop bg-ink p-6 text-white">
            <NotebookPen size={34} strokeWidth={2.25} />
            <h2 className="mt-3 font-heading text-xl font-extrabold">Public journal</h2>
            <p className="mt-1.5 text-sm font-medium text-white/75">
              Share your progress publicly if you want the extra accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
