import { Request, Response, NextFunction } from "express";
import { verifySignature, isTimestampValid } from "../services/auth.service";

// Extend Express Request to include wallet
declare global {
  namespace Express {
    interface Request {
      wallet?: string;
    }
  }
}

/**
 * Middleware to verify wallet signature and attach wallet address to request
 */
export const authenticateWallet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { wallet, signature, message, timestamp } = req.headers;

    if (!wallet || !signature || !message || !timestamp) {
      return res.status(401).json({
        error: "Missing authentication headers",
        required: ["wallet", "signature", "message", "timestamp"],
      });
    }

    // Validate timestamp
    const timestampNum = parseInt(timestamp as string);
    if (!isTimestampValid(timestampNum)) {
      return res.status(401).json({ error: "Timestamp expired or invalid" });
    }

    // Verify signature
    const isValid = verifySignature(
      message as string,
      signature as string,
      wallet as string
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Attach wallet to request
    req.wallet = wallet as string;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

/**
 * Optional auth middleware - attaches wallet if provided, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { wallet, signature, message, timestamp } = req.headers;

    if (wallet && signature && message && timestamp) {
      const timestampNum = parseInt(timestamp as string);
      if (isTimestampValid(timestampNum)) {
        const isValid = verifySignature(
          message as string,
          signature as string,
          wallet as string
        );
        if (isValid) {
          req.wallet = wallet as string;
        }
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without wallet
    next();
  }
};
