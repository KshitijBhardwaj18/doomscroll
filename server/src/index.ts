import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { initSolana } from "./config/solana";
import { prisma } from "./config/database";

// Routes
import authRoutes from "./routes/auth.routes";
import challengeRoutes from "./routes/challenge.routes";
import screentimeRoutes from "./routes/screentime.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

// Jobs
import { startChallengeSyncJob } from "./jobs/syncChallenges.job";
import { startRewardDistributionJob } from "./jobs/distributeRewards.job";

const app = express();
const PORT = parseInt(env.PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/screen-time", screentimeRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Initialize and start server
const startServer = async () => {
  try {
    console.log("🚀 Starting Doomscroll Server...\n");

    // Initialize Solana connection
    console.log("1️⃣  Initializing Solana...");
    initSolana();

    // Test database connection
    console.log("2️⃣  Connecting to database...");
    await prisma.$connect();
    console.log("✅ Database connected\n");

    // Start cron jobs
    console.log("3️⃣  Starting background jobs...");
    startChallengeSyncJob();
    startRewardDistributionJob();
    console.log();

    // Start Express server
    app.listen(PORT, () => {
      console.log("🎉 Server is running!");
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Network: ${env.SOLANA_NETWORK}`);
      console.log("\n📡 API Endpoints:");
      console.log("   GET  /health");
      console.log("");
      console.log("   Auth:");
      console.log("   POST /auth/verify");
      console.log("   GET  /auth/challenge");
      console.log("");
      console.log("   Challenges:");
      console.log("   GET  /api/challenges");
      console.log("   GET  /api/challenges/:id");
      console.log("   GET  /api/challenges/:id/participants");
      console.log("   GET  /api/challenges/:id/leaderboard");
      console.log("   POST /api/challenges/sync/:challengeId");
      console.log("");
      console.log("   Screen Time:");
      console.log("   POST /api/screen-time/report");
      console.log(
        "   GET  /api/screen-time/user/:wallet/challenge/:challengeId"
      );
      console.log("   GET  /api/screen-time/user/:wallet/challenges");
      console.log("");
      console.log("   Admin (requires x-admin-key header):");
      console.log("   POST /admin/challenges/create");
      console.log("   GET  /admin/challenges/count");
      console.log("   GET  /admin/health");
      console.log("\n✨ Ready to accept requests!\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");

  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start the server
startServer();
