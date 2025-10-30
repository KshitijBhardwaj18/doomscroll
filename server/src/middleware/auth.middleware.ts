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
    console.log("🔐 Auth middleware: Headers received:", req.headers);
    const {
      wallet,
      signature,
      message: messageBase64,
      timestamp,
    } = req.headers;

    if (!wallet || !signature || !messageBase64 || !timestamp) {
      return res.status(401).json({
        error: "Missing authentication headers",
        required: ["wallet", "signature", "message", "timestamp"],
      });
    }

    // Decode the base64-encoded message (client encodes it to avoid newline issues)
    let message: string;
    try {
      message = Buffer.from(messageBase64 as string, "base64").toString(
        "utf-8"
      );
      console.log("✅ Decoded message from base64");
    } catch (decodeError) {
      console.error("❌ Failed to decode message from base64:", decodeError);
      return res.status(401).json({ error: "Invalid message encoding" });
    }

    // Validate timestamp
    const timestampNum = parseInt(timestamp as string);
    if (!isTimestampValid(timestampNum)) {
      console.log("❌ Timestamp validation failed");
      return res.status(401).json({ error: "Timestamp expired or invalid" });
    }
    console.log("✅ Timestamp valid");

    // Verify signature
    const isValid = verifySignature(
      message,
      signature as string,
      wallet as string
    );

    if (!isValid) {
      console.log("❌ Signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }
    console.log("✅ Signature verified");

    // Attach wallet to request
    req.wallet = wallet as string;
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error);
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
    const {
      wallet,
      signature,
      message: messageBase64,
      timestamp,
    } = req.headers;

    if (wallet && signature && messageBase64 && timestamp) {
      // Decode the base64-encoded message
      const message = Buffer.from(messageBase64 as string, "base64").toString(
        "utf-8"
      );

      const timestampNum = parseInt(timestamp as string);
      if (isTimestampValid(timestampNum)) {
        const isValid = verifySignature(
          message,
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
