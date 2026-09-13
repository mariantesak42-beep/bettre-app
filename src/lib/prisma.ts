import { PrismaClient } from "@/generated/prisma/client";
import { existsSync, readdirSync } from "fs";
import path from "path";

// The "prisma-client" generator's custom `output` path bakes the query
// engine's absolute directory in as a build-time string (e.g. Vercel's
// `/vercel/path0/...`), which doesn't exist at runtime (`/var/task/...`),
// so Prisma's own binary search fails even though the file is right there.
// Point it at the real on-disk binary directly, bypassing that search.
function resolveQueryEngineLibrary(): string | undefined {
  const dir = path.join(process.cwd(), "src", "generated", "prisma");
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    return undefined;
  }
  const candidates = files.filter((f) => /^libquery_engine-.*\.node$/.test(f));
  const preferred =
    process.platform === "darwin"
      ? candidates.find((f) => f.includes("darwin"))
      : candidates.find((f) => f.includes("rhel-openssl") || f.includes("linux"));
  const chosen = preferred ?? candidates[0];
  if (!chosen) return undefined;
  const fullPath = path.join(dir, chosen);
  return existsSync(fullPath) ? fullPath : undefined;
}

if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const engineLibrary = resolveQueryEngineLibrary();
  if (engineLibrary) process.env.PRISMA_QUERY_ENGINE_LIBRARY = engineLibrary;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
