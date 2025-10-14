import { Router, Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "../config/database";
import {
  syncChallenge,
  syncParticipants,
  getChallengeDetails,
  getChallengeLeaderboard,
} from "../services/challenge.service";
import { deriveChallengePda } from "../services/solana.service";
import { optionalAuth } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

/**
 * GET /api/challenges/:id
 * Get challenge details
 */
router.get("/:id", apiLimiter, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const challenge = await getChallengeDetails(id);

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    return res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

/**
 * GET /api/challenges/:id/participants
 * Get all participants for a challenge
 */
router.get(
  "/:id/participants",
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const participants = await prisma.participant.findMany({
        where: { challengeId: id },
        include: {
          screenTimeReports: true,
        },
      });

      return res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Failed to fetch participants" });
    }
  }
);

/**
 * GET /api/challenges/:id/leaderboard
 * Get leaderboard for a challenge
 */
router.get(
  "/:id/leaderboard",
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const leaderboard = await getChallengeLeaderboard(id);

      return res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }
);

/**
 * POST /api/challenges/sync/:challengeId
 * Manually sync a challenge from blockchain
 */
router.post(
  "/sync/:challengeId",
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.challengeId);

      if (isNaN(challengeId)) {
        return res.status(400).json({ error: "Invalid challenge ID" });
      }

      // Get creator from query or fetch from existing DB record
      const existing = await prisma.challenge.findUnique({
        where: { challengeId },
      });

      if (!existing) {
        return res.status(404).json({
          error: "Challenge not found in database. Creator info needed.",
        });
      }

      const creatorPubkey = new PublicKey(existing.creator);
      const [challengePda] = deriveChallengePda(creatorPubkey, challengeId);

      const challenge = await syncChallenge(challengePda, challengeId);

      if (!challenge) {
        return res.status(404).json({ error: "Failed to sync challenge" });
      }

      // Also sync participants
      await syncParticipants(challenge.id, challengePda);

      return res.json({
        success: true,
        challenge,
      });
    } catch (error) {
      console.error("Error syncing challenge:", error);
      return res.status(500).json({ error: "Failed to sync challenge" });
    }
  }
);

/**
 * GET /api/challenges
 * Get all challenges
 */
router.get("/", apiLimiter, async (req: Request, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to 50 most recent
    });

    return res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

export default router;
