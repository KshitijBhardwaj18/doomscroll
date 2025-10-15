import { Router } from "express";
import { z } from "zod";
import { adminAuth } from "../middleware/admin.middleware";
import * as solanaService from "../services/solana.service";
import * as challengeService from "../services/challenge.service";
import { getConnection } from "../config/solana";

const router = Router();

// Validation schema for challenge creation
const createChallengeSchema = z.object({
  entry_fee: z.number().positive().int(),
  doom_threshold: z.number().positive().int().max(65535), // u16 max
  start_time: z.number().positive().int(),
  end_time: z.number().positive().int(),
});

/**
 * Admin: Create new challenge on-chain
 * POST /admin/challenges/create
 * Headers: x-admin-key
 * Body: { entry_fee, doom_threshold, start_time, end_time }
 */
router.post("/challenges/create", adminAuth, async (req, res) => {
  try {
    // Validate request body
    const validation = createChallengeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: validation.error.errors,
      });
    }

    const { entry_fee, doom_threshold, start_time, end_time } = validation.data;

    // Validate time logic
    const now = Math.floor(Date.now() / 1000);
    if (start_time <= now) {
      return res.status(400).json({
        error: "Start time must be in the future",
      });
    }
    if (end_time <= start_time) {
      return res.status(400).json({
        error: "End time must be after start time",
      });
    }

    console.log("\n🎯 Admin creating new challenge...");

    // Create challenge on-chain
    const result = await solanaService.createChallenge({
      entryFee: entry_fee,
      doomThreshold: doom_threshold,
      startTime: start_time,
      endTime: end_time,
    });

    console.log("⏳ Waiting for transaction confirmation...");

    // Wait for confirmation
    const connection = getConnection();
    await connection.confirmTransaction(result.signature, "confirmed");

    console.log("📊 Syncing challenge to database...");

    // Sync to database
    await challengeService.syncChallenge(result.challengeId);

    console.log("✅ Challenge created and synced successfully!\n");

    res.json({
      success: true,
      challenge_id: result.challengeId,
      challenge_pda: result.challengePda,
      transaction: result.signature,
      explorer: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("❌ Error creating challenge:", error);
    res.status(500).json({
      error: "Failed to create challenge",
      message: error.message,
    });
  }
});

/**
 * Admin: Get current challenge count
 * GET /admin/challenges/count
 * Headers: x-admin-key
 */
router.get("/challenges/count", adminAuth, async (req, res) => {
  try {
    const count = await solanaService.fetchGlobalCounter();
    res.json({
      challenge_count: count,
      next_challenge_id: count,
    });
  } catch (error: any) {
    console.error("Error fetching challenge count:", error);
    res.status(500).json({
      error: "Failed to fetch challenge count",
      message: error.message,
    });
  }
});

/**
 * Admin: Health check
 * GET /admin/health
 * Headers: x-admin-key
 */
router.get("/health", adminAuth, (req, res) => {
  res.json({
    status: "ok",
    message: "Admin access verified",
    timestamp: new Date().toISOString(),
  });
});

export default router;
