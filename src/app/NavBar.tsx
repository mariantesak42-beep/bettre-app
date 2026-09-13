"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Handshake,
  ListChecks,
  Newspaper,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
  HeartHandshake,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "./AuthContext";

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-ink text-white" : "text-ink/80 hover:bg-white/40"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="bg-cerulean-600">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
          <Handshake size={22} />
          Bettre
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href="/how-it-works" label="How it works" icon={<HelpCircle size={16} />} />
          <NavLink href="/feed" label="Feed" icon={<Newspaper size={16} />} />
          <NavLink href="/charities" label="Charities" icon={<HeartHandshake size={16} />} />
          {user && <NavLink href="/dashboard" label="My Bets" icon={<ListChecks size={16} />} />}
          {user && <NavLink href="/bets/new" label="New bet" icon={<Plus size={16} />} />}
        </nav>
        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-ink/70">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink/80 hover:bg-white/40"
              >
                <LogOut size={16} />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login" label="Log in" icon={<LogIn size={16} />} />
              <NavLink href="/signup" label="Sign up" icon={<UserPlus size={16} />} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
