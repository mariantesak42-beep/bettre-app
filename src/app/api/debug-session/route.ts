import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasCookie = cookieHeader.includes(SESSION_COOKIE);

  const results: Record<string, unknown> = { hasCookie };

  try {
    results.count = await prisma.session.count();
  } catch (error) {
    results.countError = error instanceof Error ? error.message : String(error);
  }

  try {
    const token = cookieHeader
      .split(";")
      .map((p) => p.trim())
      .find((p) => p.startsWith(`${SESSION_COOKIE}=`))
      ?.split("=")[1];
    results.token = token ?? null;
    if (token) {
      results.findUnique = await prisma.session.findUnique({ where: { token }, include: { user: true } });
    }
  } catch (error) {
    results.findUniqueError = error instanceof Error ? error.message : String(error);
    results.findUniqueStack = error instanceof Error ? error.stack : null;
  }

  try {
    results.getCurrentUser = await getCurrentUser();
  } catch (error) {
    results.getCurrentUserError = error instanceof Error ? error.message : String(error);
    results.getCurrentUserStack = error instanceof Error ? error.stack : null;
  }

  return NextResponse.json(results);
}
