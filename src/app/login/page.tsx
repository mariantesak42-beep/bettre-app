"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    await refresh();
    router.push(searchParams.get("next") ?? "/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="pop bg-white p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-lime-400 text-ink">
          <LogIn size={18} />
        </div>
        <h1 className="mt-4 text-center font-heading text-2xl font-extrabold text-ink">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-bold text-ink">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-2 border-ink px-3 py-2 font-medium text-ink outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ink">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-2 border-ink px-3 py-2 font-medium text-ink outline-none"
            />
          </label>
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="pop-btn bg-lime-400 px-4 py-2 font-extrabold text-ink disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm font-medium text-ink/70">
          No account yet?{" "}
          <Link href="/signup" className="font-extrabold text-flamingo-700">
            Sign up
          </Link>
        </p>

        <button
          onClick={handleTryDemo}
          disabled={startingDemo}
          className="pop-btn mt-4 flex w-full items-center justify-center gap-2 bg-white px-4 py-2 text-sm font-extrabold text-ink disabled:opacity-60"
        >
          <Sparkles size={16} />
          {startingDemo ? "Setting up…" : "Just try it — no signup"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
