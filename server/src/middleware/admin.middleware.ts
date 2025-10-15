import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Middleware to verify admin access
 * Checks for x-admin-key header matching ADMIN_SECRET_KEY
 */
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(401).json({
      error: "Unauthorized: Admin key required",
      message: "Please provide x-admin-key header",
    });
  }

  if (adminKey !== env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      error: "Forbidden: Invalid admin key",
    });
  }

  // Admin authenticated
  next();
};
