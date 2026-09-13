import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveBetIfDue } from "@/lib/evaluateBet";

export async function GET() {
  const bets = await prisma.bet.findMany({
    include: { owner: { select: { id: true, name: true } }, charity: true, witnesses: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const resolved = await Promise.all(bets.map((bet) => resolveBetIfDue(bet, bet.witnesses)));

  return NextResponse.json({
    bets: resolved.map((bet, i) => ({ ...bet, owner: bets[i].owner, charity: bets[i].charity, witnesses: bets[i].witnesses })),
  });
}
