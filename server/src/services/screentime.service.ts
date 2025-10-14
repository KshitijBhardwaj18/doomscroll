import { prisma } from "../config/database";

export interface ScreenTimeReportData {
  wallet: string;
  challengeId: string;
  socialMediaMinutes: number;
  appBreakdown?: Record<string, number>;
  reportedAt: Date;
}

/**
 * Submit a screen time report
 */
export const submitScreenTimeReport = async (data: ScreenTimeReportData) => {
  // Verify participant exists
  const participant = await prisma.participant.findUnique({
    where: {
      wallet_challengeId: {
        wallet: data.wallet,
        challengeId: data.challengeId,
      },
    },
  });

  if (!participant) {
    throw new Error("Participant not found for this challenge");
  }

  // Verify challenge is active
  const challenge = await prisma.challenge.findUnique({
    where: { id: data.challengeId },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.status !== 0) {
    throw new Error("Challenge is not active");
  }

  // Check if report is within challenge time bounds
  const now = new Date();
  if (now < challenge.startTime) {
    throw new Error("Challenge has not started yet");
  }

  if (now > challenge.endTime) {
    throw new Error("Challenge has already ended");
  }

  // Create report
  const report = await prisma.screenTimeReport.create({
    data: {
      wallet: data.wallet,
      challengeId: data.challengeId,
      socialMediaMinutes: data.socialMediaMinutes,
      appBreakdown: data.appBreakdown || {},
      reportedAt: data.reportedAt,
    },
  });

  console.log(
    `✅ Screen time report submitted by ${data.wallet}: ${data.socialMediaMinutes} minutes`
  );
  return report;
};

/**
 * Get all screen time reports for a user in a challenge
 */
export const getUserScreenTime = async (
  wallet: string,
  challengeId: string
) => {
  const reports = await prisma.screenTimeReport.findMany({
    where: {
      wallet,
      challengeId,
    },
    orderBy: {
      reportedAt: "desc",
    },
  });

  const totalMinutes = reports.reduce(
    (sum, r) => sum + r.socialMediaMinutes,
    0
  );

  return {
    reports,
    totalMinutes,
  };
};

/**
 * Get all challenges a user has joined
 */
export const getUserChallenges = async (wallet: string) => {
  const participants = await prisma.participant.findMany({
    where: { wallet },
    include: {
      challenge: true,
      screenTimeReports: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  return participants.map((p) => {
    const totalMinutes = p.screenTimeReports.reduce(
      (sum, r) => sum + r.socialMediaMinutes,
      0
    );
    return {
      ...p.challenge,
      joinedAt: p.joinedAt,
      totalScreenTime: totalMinutes,
      disqualified: p.disqualified,
    };
  });
};
