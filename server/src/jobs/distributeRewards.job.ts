import cron from "node-cron";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "../config/database";
import { determineWinners } from "../services/challenge.service";
import { distributeRewards } from "../services/solana.service";

/**
 * Check for ended challenges and distribute rewards
 * Runs every minute
 */
export const startRewardDistributionJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("💰 Starting reward distribution job...");

    try {
      // Find challenges that have ended but not yet distributed
      const now = new Date();
      const endedChallenges = await prisma.challenge.findMany({
        where: {
          endTime: {
            lt: now,
          },
          status: 1, // Ended (not yet distributed)
        },
      });

      if (endedChallenges.length === 0) {
        console.log("   No challenges ready for reward distribution");
        return;
      }

      console.log(
        `   Found ${endedChallenges.length} challenges ready for distribution`
      );

      for (const challenge of endedChallenges) {
        try {
          console.log(`   Processing challenge ${challenge.challengeId}...`);

          // Determine winners
          const winners = await determineWinners(challenge.id);

          if (winners.length === 0) {
            console.log(
              `   No winners found for challenge ${challenge.challengeId}`
            );

            // Update status to distributed even with no winners
            await prisma.challenge.update({
              where: { id: challenge.id },
              data: { status: 2 },
            });
            continue;
          }

          // Distribute rewards on-chain
          const challengePda = new PublicKey(challenge.challengePda);
          const txSignature = await distributeRewards(challengePda, winners);

          if (txSignature) {
            // Update challenge status to Distributed
            await prisma.challenge.update({
              where: { id: challenge.id },
              data: { status: 2 },
            });

            console.log(
              `   ✅ Rewards distributed for challenge ${challenge.challengeId}`
            );
            console.log(`      Winners: ${winners.length}`);
            console.log(`      Transaction: ${txSignature}`);
          } else {
            console.error(
              `   ❌ Failed to distribute rewards for challenge ${challenge.challengeId}`
            );
          }
        } catch (error) {
          console.error(
            `   Error processing challenge ${challenge.challengeId}:`,
            error
          );
        }
      }

      console.log("✅ Reward distribution job completed");
    } catch (error) {
      console.error("❌ Reward distribution job failed:", error);
    }
  });

  console.log("✅ Reward distribution job scheduled (every minute)");
};
