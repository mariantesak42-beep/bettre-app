import type { Bet } from "@/generated/prisma/client";

type BetLike = Pick<Bet, "status" | "endDate">;

export type BetStats = {
  successCount: number;
  failedCount: number;
  successRate: number | null; // null when there's no resolved history yet
  streak: number; // consecutive SUCCESS bets, most recent first, reset at the first FAILED
};

export function computeStreakAndSuccessRate(bets: BetLike[]): BetStats {
  const resolved = bets
    .filter((b) => b.status === "SUCCESS" || b.status === "FAILED")
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

  const successCount = resolved.filter((b) => b.status === "SUCCESS").length;
  const failedCount = resolved.filter((b) => b.status === "FAILED").length;
  const successRate = resolved.length > 0 ? successCount / resolved.length : null;

  let streak = 0;
  for (const bet of resolved) {
    if (bet.status !== "SUCCESS") break;
    streak += 1;
  }

  return { successCount, failedCount, successRate, streak };
}
