/**
 * Quick script to create a test challenge
 * Usage: node scripts/create-test-challenge.js
 */

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "your_admin_key_here";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

async function createTestChallenge() {
  // Create a challenge that starts in 1 hour and lasts 24 hours
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 3600; // 1 hour from now
  const endTime = startTime + 86400; // 24 hours later

  const challenge = {
    entry_fee: 1000000, // 0.001 SOL
    doom_threshold: 60, // 60 minutes
    start_time: startTime,
    end_time: endTime,
  };

  console.log("Creating test challenge...");
  console.log("Entry Fee:", challenge.entry_fee, "lamports (0.001 SOL)");
  console.log("Doom Threshold:", challenge.doom_threshold, "minutes");
  console.log("Start Time:", new Date(startTime * 1000).toISOString());
  console.log("End Time:", new Date(endTime * 1000).toISOString());
  console.log();

  try {
    const response = await fetch(`${SERVER_URL}/admin/challenges/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
      body: JSON.stringify(challenge),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data.error);
      if (data.details) {
        console.error("Details:", JSON.stringify(data.details, null, 2));
      }
      process.exit(1);
    }

    console.log("✅ Challenge created successfully!");
    console.log("Challenge ID:", data.challenge_id);
    console.log("Challenge PDA:", data.challenge_pda);
    console.log("Transaction:", data.transaction);
    console.log("Explorer:", data.explorer);
  } catch (error) {
    console.error("❌ Failed to create challenge:", error.message);
    process.exit(1);
  }
}

createTestChallenge();
