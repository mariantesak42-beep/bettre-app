import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canSelfReportFailure } from "@/lib/evaluateBet";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const bet = await prisma.bet.findUnique({ where: { id } });
  if (!bet) return NextResponse.json({ error: "Bet not found." }, { status: 404 });
  if (bet.ownerId !== user.id) {
    return NextResponse.json({ error: "Only the bet owner can do that." }, { status: 403 });
  }
  if (!canSelfReportFailure(bet)) {
    return NextResponse.json({ error: "This bet is already resolved." }, { status: 409 });
  }

  const updated = await prisma.bet.update({ where: { id }, data: { status: "FAILED" } });
  return NextResponse.json({ bet: updated });
}
