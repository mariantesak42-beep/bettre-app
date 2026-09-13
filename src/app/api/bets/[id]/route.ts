import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { resolveBetIfDue } from "@/lib/evaluateBet";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const bet = await prisma.bet.findUnique({
    where: { id },
    include: {
      witnesses: { include: { user: { select: { id: true, name: true } } } },
      charity: true,
      owner: { select: { id: true, name: true } },
    },
  });
  if (!bet) return NextResponse.json({ error: "Bet not found." }, { status: 404 });

  const resolved = await resolveBetIfDue(bet, bet.witnesses);

  return NextResponse.json({ bet: { ...bet, status: resolved.status } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const bet = await prisma.bet.findUnique({ where: { id } });
  if (!bet) return NextResponse.json({ error: "Bet not found." }, { status: 404 });
  if (bet.ownerId !== user.id) {
    return NextResponse.json({ error: "Only the bet owner can do that." }, { status: 403 });
  }

  const body = await request.json();
  if (typeof body.isJournalPublic !== "boolean") {
    return NextResponse.json({ error: "isJournalPublic must be a boolean." }, { status: 400 });
  }

  const updated = await prisma.bet.update({
    where: { id },
    data: { isJournalPublic: body.isJournalPublic },
  });

  return NextResponse.json({ bet: updated });
}
