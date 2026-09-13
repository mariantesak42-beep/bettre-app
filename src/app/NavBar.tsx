"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ListChecks,
  Newspaper,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
  HeartHandshake,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import Star from "./Star";

function NavLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`pop-btn flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold ${
        active ? "bg-ink text-white" : "bg-white text-ink"
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
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/");
  }

  const links = (
    <>
      <NavLink href="/how-it-works" label="How it works" icon={<HelpCircle size={16} />} onClick={() => setMenuOpen(false)} />
      <NavLink href="/feed" label="Feed" icon={<Newspaper size={16} />} onClick={() => setMenuOpen(false)} />
      <NavLink href="/charities" label="Charities" icon={<HeartHandshake size={16} />} onClick={() => setMenuOpen(false)} />
      {user && <NavLink href="/dashboard" label="My Bets" icon={<ListChecks size={16} />} onClick={() => setMenuOpen(false)} />}
      {user && <NavLink href="/bets/new" label="New bet" icon={<Plus size={16} />} onClick={() => setMenuOpen(false)} />}
    </>
  );

  return (
    <header className="border-b-[3px] border-ink bg-lime-500">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 font-heading text-2xl font-extrabold text-ink">
          Bettre
          <Star className="h-4 w-4 text-flamingo-500" />
        </Link>

        <nav className="hidden flex-wrap items-center gap-2 lg:flex">{links}</nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? null : user ? (
            <>
              <span className="text-sm font-bold text-ink">{user.name}</span>
              <button
                onClick={handleLogout}
                className="pop-btn flex items-center gap-1.5 bg-white px-3.5 py-1.5 text-sm font-bold text-ink"
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

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="pop-btn flex h-10 w-10 items-center justify-center bg-white text-ink lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-2 border-t-[3px] border-ink bg-lime-500 px-4 py-4 lg:hidden">
          <div className="flex flex-wrap gap-2">{links}</div>
          <div className="mt-2 flex flex-wrap gap-2 border-t-2 border-ink/20 pt-3">
            {loading ? null : user ? (
              <>
                <span className="flex items-center px-1 text-sm font-bold text-ink">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="pop-btn flex items-center gap-1.5 bg-white px-3.5 py-1.5 text-sm font-bold text-ink"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login" label="Log in" icon={<LogIn size={16} />} onClick={() => setMenuOpen(false)} />
                <NavLink href="/signup" label="Sign up" icon={<UserPlus size={16} />} onClick={() => setMenuOpen(false)} />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
