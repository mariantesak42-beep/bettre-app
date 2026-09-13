import type { Bet, BetStatus, WitnessResponse } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Days after endDate a still-PENDING witness gets before their non-response
 * is treated as an implicit failure vote. Exported as a named constant
 * because the witness-disagreement rule is expected to change after real
 * user testing.
 */
export const WITNESS_RESPONSE_GRACE_DAYS = 3;

type BetLike = Pick<Bet, "status" | "endDate">;
type WitnessLike = { response: WitnessResponse };

export type EvaluationOutcome = { status: "SUCCESS" | "FAILED" } | null;

/**
 * Pure — no Prisma import, no I/O, no side effects. Returns null when the
 * bet is not yet due for evaluation (still ACTIVE before endDate, or within
 * the grace window with no explicit failure vote yet).
 */
export function evaluateBet(
  bet: BetLike,
  witnesses: WitnessLike[],
  now: Date = new Date()
): EvaluationOutcome {
  if (bet.status !== "ACTIVE") return null;
  if (now < bet.endDate) return null;

  const hasFailureVote = witnesses.some((w) => w.response === "CONFIRMED_FAILURE");
  if (hasFailureVote) return { status: "FAILED" };

  const allConfirmedSuccess =
    witnesses.length > 0 && witnesses.every((w) => w.response === "CONFIRMED_SUCCESS");
  if (allConfirmedSuccess) return { status: "SUCCESS" };

  // Someone is still PENDING — wait out the grace period before deciding.
  // Benefit of the doubt goes to the charity, not the user.
  const graceDeadline = new Date(bet.endDate.getTime() + WITNESS_RESPONSE_GRACE_DAYS * 86_400_000);
  if (now >= graceDeadline) return { status: "FAILED" };
  return null;
}

/**
 * The owner can self-report failure at any time while ACTIVE — a distinct,
 * unconditional action, separate from the endDate/grace evaluation above.
 */
export function canSelfReportFailure(bet: Pick<Bet, "status">): boolean {
  return bet.status === "ACTIVE";
}

/**
 * Every read path uses this instead of trusting a possibly-stale
 * bet.status: evaluates, and if due, persists the new status before
 * returning.
 */
export async function resolveBetIfDue(bet: Bet, witnesses: WitnessLike[]): Promise<Bet> {
  const outcome = evaluateBet(bet, witnesses);
  if (!outcome) return bet;
  return prisma.bet.update({ where: { id: bet.id }, data: { status: outcome.status as BetStatus } });
}
