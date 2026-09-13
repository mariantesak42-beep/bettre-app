import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const bet = await prisma.bet.findUnique({
    where: { id },
    include: { witnesses: { select: { userId: true } } },
  });
  if (!bet) return NextResponse.json({ error: "Bet not found." }, { status: 404 });

  const user = await getCurrentUser();
  const isOwner = user?.id === bet.ownerId;
  const isWitness = !!user && bet.witnesses.some((w) => w.userId === user.id);

  if (!bet.isJournalPublic && !isOwner && !isWitness) {
    return NextResponse.json({ error: "This journal is private." }, { status: 403 });
  }

  const entries = await prisma.journalEntry.findMany({
    where: { betId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ entries });
}
