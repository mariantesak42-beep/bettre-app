import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json();
  const betId = typeof body.betId === "string" ? body.betId : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!betId || !content) {
    return NextResponse.json({ error: "betId and content are required." }, { status: 400 });
  }

  const bet = await prisma.bet.findUnique({ where: { id: betId } });
  if (!bet) return NextResponse.json({ error: "Bet not found." }, { status: 404 });
  if (bet.ownerId !== user.id) {
    return NextResponse.json({ error: "Only the bet owner can add journal entries." }, { status: 403 });
  }

  const entry = await prisma.journalEntry.create({
    data: { betId, authorId: user.id, content },
  });

  return NextResponse.json({ entry });
}
