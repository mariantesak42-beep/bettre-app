import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const VALID_RESPONSES = ["CONFIRMED_SUCCESS", "CONFIRMED_FAILURE"];

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json();
  if (!VALID_RESPONSES.includes(body.response)) {
    return NextResponse.json({ error: "Invalid response." }, { status: 400 });
  }

  const witness = await prisma.witness.findUnique({ where: { inviteToken: token }, include: { bet: true } });
  if (!witness) return NextResponse.json({ error: "Witness not found." }, { status: 404 });
  if (witness.userId !== user.id) {
    return NextResponse.json({ error: "You're not this witness." }, { status: 403 });
  }
  if (witness.bet.status !== "ACTIVE") {
    return NextResponse.json({ error: "This bet has already been resolved." }, { status: 409 });
  }

  const updated = await prisma.witness.update({
    where: { id: witness.id },
    data: { response: body.response, respondedAt: new Date() },
  });

  return NextResponse.json({ witness: updated });
}
