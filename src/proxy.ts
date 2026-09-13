import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PAGE_PATHS = ["/", "/login", "/signup", "/feed", "/charities", "/how-it-works"];

// /bets/[id] (detail viewing) is public; /bets/new (creation) is not — the
// negative lookahead keeps "new" out of the public-detail match.
const BET_DETAIL_PATH = /^\/bets\/(?!new$)[^/]+$/;
const INVITE_PATH = /^\/invite\/[^/]+$/;

const PUBLIC_API_RULES: { method: string; pattern: RegExp }[] = [
  { method: "GET", pattern: /^\/api\/debug-session$/ }, // temporary diagnostic route, remove with it
  { method: "GET", pattern: /^\/api\/feed$/ },
  { method: "GET", pattern: /^\/api\/charities$/ },
  { method: "GET", pattern: /^\/api\/bets\/[^/]+$/ },
  { method: "GET", pattern: /^\/api\/bets\/[^/]+\/journal-entries$/ }, // handler itself still checks isJournalPublic / owner / witness
  { method: "GET", pattern: /^\/api\/witnesses\/[^/]+$/ },
];

function isPublicPage(pathname: string): boolean {
  if (PUBLIC_PAGE_PATHS.includes(pathname)) return true;
  if (BET_DETAIL_PATH.test(pathname)) return true;
  if (INVITE_PATH.test(pathname)) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  if (!pathname.startsWith("/api/") && isPublicPage(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api/") &&
    PUBLIC_API_RULES.some((rule) => rule.method === request.method && rule.pattern.test(pathname))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let authenticated = false;
  let proxyError: string | null = null;
  if (token) {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
        select: { expiresAt: true },
      });
      authenticated = !!session && session.expiresAt > new Date();
    } catch (error) {
      proxyError = error instanceof Error ? error.message : String(error);
    }
  }

  if (authenticated) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authenticated.", proxyError }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // charities/ excluded too — those are static logo files under public/charities/*,
  // not the /charities page route (which has no trailing segment), and they must
  // stay reachable by logged-out visitors browsing the public charity directory.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|charities/).*)"],
};
