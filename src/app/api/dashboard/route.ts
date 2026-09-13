import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { resolveBetIfDue } from "@/lib/evaluateBet";
import { computeStreakAndSuccessRate } from "@/lib/stats";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const bets = await prisma.bet.findMany({
    where: { ownerId: user.id },
    include: { witnesses: true, charity: true },
    orderBy: { createdAt: "desc" },
  });

  const resolvedBets = await Promise.all(bets.map((bet) => resolveBetIfDue(bet, bet.witnesses)));
  const merged = resolvedBets.map((bet, i) => ({ ...bet, witnesses: bets[i].witnesses, charity: bets[i].charity }));

  const activeBets = merged.filter((b) => b.status === "ACTIVE");
  const historyBets = merged.filter((b) => b.status !== "ACTIVE");
  const stats = computeStreakAndSuccessRate(merged);

  return NextResponse.json({ activeBets, historyBets, stats });
}
