import Link from "next/link";
import { Users, HeartHandshake, NotebookPen } from "lucide-react";
import Star from "./Star";

export default function Home() {
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
            Set a goal and put something on the line. Pull it off, and you win. Don&apos;t, and your
            stake goes straight to a cause you chose in advance. There&apos;s no losing move — either
            you get better, or the world does.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="pop-btn bg-flamingo-500 px-7 py-3 text-lg font-extrabold text-ink">
              Make a bet
            </Link>
            <Link href="/feed" className="pop-btn bg-white px-7 py-3 text-lg font-extrabold text-ink">
              See the feed
            </Link>
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
