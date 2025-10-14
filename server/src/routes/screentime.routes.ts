import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  submitScreenTimeReport,
  getUserScreenTime,
  getUserChallenges,
} from "../services/screentime.service";
import { authenticateWallet } from "../middleware/auth.middleware";
import {
  screenTimeLimiter,
  apiLimiter,
} from "../middleware/rateLimit.middleware";

const router = Router();

// Validation schema for screen time report
const reportSchema = z.object({
  challenge_id: z.string().uuid(),
  social_media_minutes: z.number().int().min(0),
  app_breakdown: z.record(z.number()).optional(),
  timestamp: z.number(),
});

/**
 * POST /api/screen-time/report
 * Submit a screen time report (requires authentication)
 */
router.post(
  "/report",
  authenticateWallet,
  screenTimeLimiter,
  async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = reportSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validation.error.errors,
        });
      }

      const { challenge_id, social_media_minutes, app_breakdown, timestamp } =
        validation.data;

      // Submit report
      const report = await submitScreenTimeReport({
        wallet: req.wallet!,
        challengeId: challenge_id,
        socialMediaMinutes: social_media_minutes,
        appBreakdown: app_breakdown,
        reportedAt: new Date(timestamp),
      });

      return res.json({
        success: true,
        report,
      });
    } catch (error: any) {
      console.error("Error submitting screen time report:", error);
      return res
        .status(400)
        .json({ error: error.message || "Failed to submit report" });
    }
  }
);

/**
 * GET /api/screen-time/user/:wallet/challenge/:challengeId
 * Get screen time for a specific user in a challenge
 */
router.get(
  "/user/:wallet/challenge/:challengeId",
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { wallet, challengeId } = req.params;

      const data = await getUserScreenTime(wallet, challengeId);

      return res.json(data);
    } catch (error) {
      console.error("Error fetching user screen time:", error);
      return res.status(500).json({ error: "Failed to fetch screen time" });
    }
  }
);

/**
 * GET /api/screen-time/user/:wallet/challenges
 * Get all challenges a user has joined
 */
router.get(
  "/user/:wallet/challenges",
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { wallet } = req.params;

      const challenges = await getUserChallenges(wallet);

      return res.json(challenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      return res.status(500).json({ error: "Failed to fetch challenges" });
    }
  }
);

export default router;
