import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { resolveBetIfDue } from "@/lib/evaluateBet";
import { MIN_WITNESSES } from "@/lib/constants";
import type { GoalKind } from "@/generated/prisma/client";

function newInviteToken() {
  return randomBytes(20).toString("hex");
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json();
  const goalText = typeof body.goalText === "string" ? body.goalText.trim() : "";
  const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : null;
  const goalKind: GoalKind = body.goalKind === "OBJECTIVE" ? "OBJECTIVE" : "SUBJECTIVE";
  const stakeAmount = Number.isFinite(body.stakeAmount) ? Math.max(0, Math.round(body.stakeAmount)) : 0;
  const charityId = typeof body.charityId === "string" && body.charityId ? body.charityId : null;
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const isJournalPublic = body.isJournalPublic === true;
  const witnessLabels: string[] = Array.isArray(body.witnesses)
    ? body.witnesses.filter((w: unknown) => typeof w === "string")
    : [];

  if (!goalText) {
    return NextResponse.json({ error: "Goal text is required." }, { status: 400 });
  }
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
    return NextResponse.json({ error: "End date must be after start date." }, { status: 400 });
  }
  if (witnessLabels.length < MIN_WITNESSES) {
    return NextResponse.json(
      { error: `At least ${MIN_WITNESSES} witnesses are required.` },
      { status: 400 }
    );
  }

  const bet = await prisma.bet.create({
    data: {
      ownerId: user.id,
      goalText,
      category,
      goalKind,
      stakeAmount,
      charityId,
      startDate,
      endDate,
      isJournalPublic,
      witnesses: {
        create: witnessLabels.map((label) => ({
          label: label || null,
          inviteToken: newInviteToken(),
        })),
      },
    },
    include: { witnesses: true },
  });

  return NextResponse.json({ bet });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const bets = await prisma.bet.findMany({
    where: { OR: [{ ownerId: user.id }, { witnesses: { some: { userId: user.id } } }] },
    include: { witnesses: true, charity: true },
    orderBy: { createdAt: "desc" },
  });

  const resolved = await Promise.all(bets.map((bet) => resolveBetIfDue(bet, bet.witnesses)));

  return NextResponse.json({ bets: resolved.map((bet, i) => ({ ...bet, witnesses: bets[i].witnesses, charity: bets[i].charity })) });
}
