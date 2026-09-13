import Link from "next/link";
import { Handshake, Users, HeartHandshake, NotebookPen } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="bg-cerulean-600 text-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <Handshake size={56} className="mx-auto text-ink" />
          <h1 className="mt-5 text-5xl font-bold tracking-tight">Bettre</h1>
          <p className="mt-3 text-lg font-semibold text-flamingo-700">
            Bettre yourself or Bettre the world.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-ink/80">
            Set a goal and put something on the line. Pull it off, and you win. Don&apos;t, and your
            stake goes straight to a cause you chose in advance. There&apos;s no losing move — either
            you get better, or the world does.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-flamingo-500 px-6 py-2.5 font-semibold text-ink shadow-lg shadow-cerulean-900/20 hover:bg-flamingo-600"
            >
              Make a bet
            </Link>
            <Link
              href="/feed"
              className="rounded-full border border-ink/30 px-6 py-2.5 font-medium text-ink hover:bg-white/40"
            >
              See the feed
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl bg-cerulean-600 p-5 text-ink shadow-sm">
            <Users size={36} />
            <h2 className="mt-3 font-semibold">Witnesses</h2>
            <p className="mt-1 text-sm text-ink/70">
              At least two people confirm whether you actually pulled it off.
            </p>
          </div>
          <div className="rounded-2xl bg-flamingo-500 p-5 text-ink shadow-sm">
            <HeartHandshake size={36} />
            <h2 className="mt-3 font-semibold">Charity stake</h2>
            <p className="mt-1 text-sm text-ink/70">
              Fail, and your stake goes to a cause you picked — so even a loss does some good.
            </p>
          </div>
          <div className="rounded-2xl bg-ink p-5 text-white shadow-sm">
            <NotebookPen size={36} />
            <h2 className="mt-3 font-semibold">Public journal</h2>
            <p className="mt-1 text-sm text-white/70">
              Share your progress publicly if you want the extra accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
