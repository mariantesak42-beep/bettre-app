import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary diagnostic route — reports env-var presence (never values) and
// whether an actual DB query succeeds, to isolate a production 500 without
// exposing secrets. Delete once the real cause is found.
export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasDatabaseUrlUnpooled = !!process.env.DATABASE_URL_UNPOOLED;

  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.charity.count();
    dbOk = true;
  } catch (error) {
    dbError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({ hasDatabaseUrl, hasDatabaseUrlUnpooled, dbOk, dbError });
}
