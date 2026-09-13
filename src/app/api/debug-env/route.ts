import { NextResponse } from "next/server";
import { existsSync, readdirSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// Temporary diagnostic route — reports env-var presence (never values),
// whether an actual DB query succeeds, and whether the query-engine binary
// is actually present on disk at runtime. Delete once the real cause is found.
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

  const generatedDir = path.join(process.cwd(), "src", "generated", "prisma");
  let generatedDirFiles: string[] = [];
  let generatedDirExists = false;
  try {
    generatedDirExists = existsSync(generatedDir);
    if (generatedDirExists) generatedDirFiles = readdirSync(generatedDir);
  } catch (error) {
    generatedDirFiles = [`readdir error: ${error instanceof Error ? error.message : String(error)}`];
  }

  return NextResponse.json({
    hasDatabaseUrl,
    hasDatabaseUrlUnpooled,
    dbOk,
    dbError,
    cwd: process.cwd(),
    generatedDir,
    generatedDirExists,
    generatedDirFiles,
  });
}
