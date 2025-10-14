import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram, getVerifierKeypair } from "../config/solana";
import * as anchor from "@coral-xyz/anchor";

export interface ChallengeData {
  id: number;
  creator: PublicKey;
  entryFee: anchor.BN;
  doomThreshold: anchor.BN;
  startTime: anchor.BN;
  endTime: anchor.BN;
  participantCount: number;
  verifier: PublicKey;
  status: number;
  bump: number;
}

export interface ParticipantData {
  user: PublicKey;
  challenge: PublicKey;
  deposited: anchor.BN;
  joinedAt: anchor.BN;
  disqualified: boolean;
  bump: number;
}

/**
 * Fetch global counter to get total number of challenges
 */
export const fetchGlobalCounter = async (): Promise<number> => {
  try {
    const program = getProgram();
    const [globalCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_counter")],
      program.programId
    );

    const counterAccount = await program.account.globalCounter.fetch(
      globalCounterPda
    );
    return (counterAccount as any).challengeCount;
  } catch (error) {
    console.error("Error fetching global counter:", error);
    return 0;
  }
};

/**
 * Derive challenge PDA address
 */
export const deriveChallengePda = (
  creator: PublicKey,
  challengeId: number
): [PublicKey, number] => {
  const program = getProgram();
  return PublicKey.findProgramAddressSync(
    [Buffer.from("challenge"), creator.toBuffer(), Buffer.from([challengeId])],
    program.programId
  );
};

/**
 * Fetch challenge data from blockchain
 */
export const fetchChallengeFromChain = async (
  challengePda: PublicKey
): Promise<ChallengeData | null> => {
  try {
    const program = getProgram();
    const challengeAccount = await program.account.challenge.fetch(
      challengePda
    );
    return challengeAccount as ChallengeData;
  } catch (error) {
    console.error(
      `Error fetching challenge ${challengePda.toBase58()}:`,
      error
    );
    return null;
  }
};

/**
 * Derive participant PDA address
 */
export const deriveParticipantPda = (
  challengePda: PublicKey,
  userWallet: PublicKey
): [PublicKey, number] => {
  const program = getProgram();
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("participant"),
      challengePda.toBuffer(),
      userWallet.toBuffer(),
    ],
    program.programId
  );
};

/**
 * Fetch all participants for a challenge
 */
export const fetchAllParticipants = async (
  challengePda: PublicKey
): Promise<Array<{ pubkey: PublicKey; account: ParticipantData }>> => {
  try {
    const program = getProgram();

    // Get all participant accounts
    const participants = await program.account.participant.all([
      {
        memcmp: {
          offset: 8 + 32, // Skip discriminator + user field
          bytes: challengePda.toBase58(),
        },
      },
    ]);

    return participants.map((p) => ({
      pubkey: p.publicKey,
      account: p.account as ParticipantData,
    }));
  } catch (error) {
    console.error(
      `Error fetching participants for challenge ${challengePda.toBase58()}:`,
      error
    );
    return [];
  }
};

/**
 * Call distribute_rewards instruction on-chain
 */
export const distributeRewards = async (
  challengePda: PublicKey,
  winners: Array<{ participantPda: PublicKey; walletAddress: PublicKey }>
): Promise<string | null> => {
  try {
    const program = getProgram();
    const verifier = getVerifierKeypair();

    // Fetch challenge to get creator for derivation
    const challenge = await fetchChallengeFromChain(challengePda);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    // Derive escrow PDA
    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), challengePda.toBuffer()],
      program.programId
    );

    // Build remaining accounts array: [participant_pda, winner_wallet] pairs
    const remainingAccounts = winners.flatMap((winner) => [
      {
        pubkey: winner.participantPda,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: winner.walletAddress,
        isSigner: false,
        isWritable: true,
      },
    ]);

    // Call distribute_rewards
    const tx = await program.methods
      .distributeRewards()
      .accounts({
        challenge: challengePda,
        escrow: escrowPda,
        verifier: verifier.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts(remainingAccounts)
      .signers([verifier])
      .rpc();

    console.log(
      `✅ Rewards distributed for challenge ${challengePda.toBase58()}`
    );
    console.log(`   Transaction: ${tx}`);
    console.log(`   Winners: ${winners.length}`);

    return tx;
  } catch (error) {
    console.error(
      `Error distributing rewards for challenge ${challengePda.toBase58()}:`,
      error
    );
    return null;
  }
};
