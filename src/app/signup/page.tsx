"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useAuth } from "../AuthContext";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
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
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-flamingo-500 text-ink">
          <UserPlus size={18} />
        </div>
        <h1 className="mt-3 text-center text-2xl font-bold text-zinc-900">Sign up</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </label>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-flamingo-500 px-4 py-2 font-medium text-ink hover:bg-flamingo-600 hover:text-white disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cerulean-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
