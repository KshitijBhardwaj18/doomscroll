import { PublicKey } from "@solana/web3.js";
import { prisma } from "../config/database";
import {
  fetchChallengeFromChain,
  fetchAllParticipants,
  ChallengeData,
  ParticipantData,
} from "./solana.service";

/**
 * Sync a single challenge from blockchain to database
 */
export const syncChallenge = async (
  challengePda: PublicKey,
  challengeId: number
) => {
  try {
    const onChainData = await fetchChallengeFromChain(challengePda);
    if (!onChainData) {
      console.log(`Challenge ${challengeId} not found on-chain`);
      return null;
    }

    // Upsert challenge
    const challenge = await prisma.challenge.upsert({
      where: { challengeId },
      create: {
        challengeId,
        challengePda: challengePda.toBase58(),
        creator: onChainData.creator.toBase58(),
        entryFee: onChainData.entryFee.toString(),
        doomThreshold: onChainData.doomThreshold.toNumber(),
        startTime: new Date(onChainData.startTime.toNumber() * 1000),
        endTime: new Date(onChainData.endTime.toNumber() * 1000),
        status: onChainData.status,
        participantCount: onChainData.participantCount,
        totalPool: "0",
      },
      update: {
        status: onChainData.status,
        participantCount: onChainData.participantCount,
      },
    });

    console.log(`✅ Synced challenge ${challengeId}`);
    return challenge;
  } catch (error) {
    console.error(`Error syncing challenge ${challengeId}:`, error);
    return null;
  }
};

/**
 * Sync participants for a challenge
 */
export const syncParticipants = async (
  challengeId: string,
  challengePda: PublicKey
) => {
  try {
    const onChainParticipants = await fetchAllParticipants(challengePda);

    for (const { pubkey, account } of onChainParticipants) {
      await prisma.participant.upsert({
        where: { participantPda: pubkey.toBase58() },
        create: {
          wallet: account.user.toBase58(),
          challengeId,
          participantPda: pubkey.toBase58(),
          deposited: account.deposited.toString(),
          joinedAt: new Date(account.joinedAt.toNumber() * 1000),
          disqualified: account.disqualified,
        },
        update: {
          disqualified: account.disqualified,
        },
      });
    }

    console.log(
      `✅ Synced ${onChainParticipants.length} participants for challenge ${challengeId}`
    );
  } catch (error) {
    console.error(
      `Error syncing participants for challenge ${challengeId}:`,
      error
    );
  }
};

/**
 * Get challenge with participants and screen time data
 */
export const getChallengeDetails = async (challengeId: string) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      participants: {
        include: {
          screenTimeReports: true,
        },
      },
    },
  });
};

/**
 * Get leaderboard for a challenge (sorted by usage, ascending)
 */
export const getChallengeLeaderboard = async (challengeId: string) => {
  const participants = await prisma.participant.findMany({
    where: { challengeId },
    include: {
      screenTimeReports: true,
    },
  });

  // Calculate total screen time for each participant
  const leaderboard = participants.map((p) => {
    const totalMinutes = p.screenTimeReports.reduce(
      (sum, report) => sum + report.socialMediaMinutes,
      0
    );
    return {
      wallet: p.wallet,
      totalMinutes,
      disqualified: p.disqualified,
      joinedAt: p.joinedAt,
    };
  });

  // Sort by total minutes (ascending - lower is better)
  return leaderboard.sort((a, b) => a.totalMinutes - b.totalMinutes);
};

/**
 * Determine winners for a challenge
 */
export const determineWinners = async (challengeId: string) => {
  // Get challenge and threshold
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { participants: true },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  // Get screen time totals per participant
  const participantUsage = await prisma.screenTimeReport.groupBy({
    by: ["wallet"],
    where: { challengeId },
    _sum: { socialMediaMinutes: true },
  });

  // Filter winners: usage < threshold && !disqualified
  const winners = participantUsage
    .filter((p) => {
      const participant = challenge.participants.find(
        (x) => x.wallet === p.wallet
      );
      if (!participant) return false;

      const totalMinutes = p._sum.socialMediaMinutes || 0;
      return (
        !participant.disqualified && totalMinutes < challenge.doomThreshold
      );
    })
    .map((p) => {
      const participant = challenge.participants.find(
        (x) => x.wallet === p.wallet
      );
      return {
        wallet: p.wallet,
        participantPda: new PublicKey(participant!.participantPda),
        walletAddress: new PublicKey(p.wallet),
        totalMinutes: p._sum.socialMediaMinutes || 0,
      };
    });

  console.log(`Found ${winners.length} winners for challenge ${challengeId}`);
  return winners;
};
