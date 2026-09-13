import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const witness = await prisma.witness.findUnique({
    where: { inviteToken: token },
    include: {
      bet: { include: { owner: { select: { id: true, name: true } } } },
      user: { select: { id: true, name: true } },
    },
  });
  if (!witness) return NextResponse.json({ error: "Invite not found." }, { status: 404 });

  return NextResponse.json({ witness });
}
