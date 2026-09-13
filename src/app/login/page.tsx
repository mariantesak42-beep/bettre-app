"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useAuth } from "../AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cerulean-600 text-ink">
          <LogIn size={18} />
        </div>
        <h1 className="mt-3 text-center text-2xl font-bold text-zinc-900">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-cerulean-600 px-4 py-2 font-medium text-ink hover:bg-cerulean-700 hover:text-white disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-cerulean-700">
            Sign up
          </Link>
        </p>
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
