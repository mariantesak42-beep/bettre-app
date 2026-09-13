import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, startSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await startSession(user.id);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
