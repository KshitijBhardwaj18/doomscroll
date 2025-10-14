import cron from "node-cron";
import { PublicKey } from "@solana/web3.js";
import {
  fetchGlobalCounter,
  deriveChallengePda,
} from "../services/solana.service";
import { syncChallenge, syncParticipants } from "../services/challenge.service";
import { prisma } from "../config/database";

/**
 * Sync active challenges from blockchain to database
 * Runs every 5 minutes
 */
export const startChallengeSyncJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔄 Starting challenge sync job...");

    try {
      // Get total number of challenges from global counter
      const totalChallenges = await fetchGlobalCounter();
      console.log(`   Found ${totalChallenges} total challenges on-chain`);

      // Get existing challenges from DB to determine which ones need syncing
      const existingChallenges = await prisma.challenge.findMany({
        select: { challengeId: true },
      });

      const existingIds = new Set(existingChallenges.map((c) => c.challengeId));

      // Sync new challenges (ones we don't have in DB yet)
      for (let i = 0; i < totalChallenges; i++) {
        if (!existingIds.has(i)) {
          try {
            // We need the creator to derive the PDA
            // For now, we'll skip new challenges in this job
            // They should be synced manually when created or via event listener
            console.log(`   Skipping new challenge ${i} (needs creator info)`);
          } catch (error) {
            console.error(`   Error syncing challenge ${i}:`, error);
          }
        }
      }

      // Update existing active challenges
      const activeChallenges = await prisma.challenge.findMany({
        where: {
          status: {
            in: [0, 1], // Active or Ended (not yet distributed)
          },
        },
      });

      console.log(`   Updating ${activeChallenges.length} active challenges`);

      for (const challenge of activeChallenges) {
        try {
          const challengePda = new PublicKey(challenge.challengePda);
          await syncChallenge(challengePda, challenge.challengeId);
          await syncParticipants(challenge.id, challengePda);
        } catch (error) {
          console.error(
            `   Error updating challenge ${challenge.challengeId}:`,
            error
          );
        }
      }

      console.log("✅ Challenge sync job completed");
    } catch (error) {
      console.error("❌ Challenge sync job failed:", error);
    }
  });

  console.log("✅ Challenge sync job scheduled (every 5 minutes)");
};
