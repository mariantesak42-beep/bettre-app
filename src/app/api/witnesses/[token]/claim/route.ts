import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const witness = await prisma.witness.findUnique({
    where: { inviteToken: token },
    include: { bet: true },
  });
  if (!witness) return NextResponse.json({ error: "Invite not found." }, { status: 404 });

  if (witness.userId) {
    if (witness.userId === user.id) {
      return NextResponse.json({ witness });
    }
    return NextResponse.json({ error: "This invite has already been claimed." }, { status: 409 });
  }
  if (witness.bet.ownerId === user.id) {
    return NextResponse.json({ error: "You can't witness your own bet." }, { status: 400 });
  }

  try {
    const updated = await prisma.witness.update({
      where: { id: witness.id },
      data: { userId: user.id },
    });
    return NextResponse.json({ witness: updated });
  } catch {
    return NextResponse.json(
      { error: "You're already a witness on this bet." },
      { status: 409 }
    );
  }
}
