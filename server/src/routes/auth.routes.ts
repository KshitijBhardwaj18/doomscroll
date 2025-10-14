import { Router, Request, Response } from "express";
import {
  generateAuthMessage,
  verifySignature,
  isTimestampValid,
} from "../services/auth.service";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

/**
 * POST /auth/verify
 * Verify wallet signature and return authentication status
 */
router.post("/verify", authLimiter, (req: Request, res: Response) => {
  try {
    const { wallet, signature, message, timestamp } = req.body;

    if (!wallet || !signature || !message || !timestamp) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["wallet", "signature", "message", "timestamp"],
      });
    }

    // Validate timestamp
    if (!isTimestampValid(timestamp)) {
      return res.status(401).json({ error: "Timestamp expired or invalid" });
    }

    // Verify signature
    const isValid = verifySignature(message, signature, wallet);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    return res.json({
      success: true,
      wallet,
      authenticated: true,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * GET /auth/challenge
 * Get a challenge message to sign
 */
router.get("/challenge", (req: Request, res: Response) => {
  const { wallet } = req.query;

  if (!wallet || typeof wallet !== "string") {
    return res.status(400).json({ error: "Wallet address required" });
  }

  const timestamp = Date.now();
  const message = generateAuthMessage(wallet, timestamp);

  return res.json({
    message,
    timestamp,
  });
});

export default router;
