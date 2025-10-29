import { Router, Request, Response } from "express";
import { authenticateWallet } from "../middleware/auth.middleware";
import { apiLimiter } from "../middleware/rateLimit.middleware";
import * as userService from "../services/user.service";
import { z } from "zod";

const router = Router();

// Validation schemas
const checkUserSchema = z.object({
  wallet: z.string().min(32).max(44),
});

const signupSchema = z.object({
  wallet: z.string().min(32).max(44),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  doomscrollLimit: z.number().int().min(30).max(300),
});

/**
 * POST /api/user/check
 * Check if a user exists
 */
router.post(
  "/check",
  authenticateWallet,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const validation = checkUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validation.error.errors,
        });
      }

      const { wallet } = validation.data;

      // Verify authenticated wallet matches requested wallet
      if (req.wallet !== wallet) {
        return res.status(403).json({
          error: "Cannot check other user's wallet",
        });
      }

      const result = await userService.checkUserExists(wallet);
      res.json(result);
    } catch (error: any) {
      console.error("Error checking user:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/user/signup
 * Create a new user account
 */
router.post(
  "/signup",
  authenticateWallet,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const validation = signupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validation.error.errors,
        });
      }

      const { wallet, name, email, doomscrollLimit } = validation.data;

      // Verify authenticated wallet matches signup wallet
      if (req.wallet !== wallet) {
        return res.status(403).json({
          error: "Cannot signup for other wallet",
        });
      }

      const user = await userService.createUser({
        wallet,
        name,
        email,
        doomscrollLimit,
      });

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error("Error creating user:", error);

      if (error.message === "User already exists") {
        return res.status(409).json({ error: error.message });
      }

      if (error.message === "Email already in use") {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

/**
 * GET /api/user/:wallet
 * Get user details by wallet
 */
router.get(
  "/:wallet",
  authenticateWallet,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { wallet } = req.params;

      // Verify authenticated wallet matches requested wallet
      if (req.wallet !== wallet) {
        return res.status(403).json({
          error: "Cannot access other user's data",
        });
      }

      const user = await userService.getUserByWallet(wallet);
      res.json({ user });
    } catch (error: any) {
      console.error("Error fetching user:", error);

      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

export default router;
