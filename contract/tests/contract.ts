import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Doomscroll } from "../target/types/doomscroll";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { assert } from "chai";

describe("contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Doomscroll as Program<Doomscroll>;

  async function getNextChallengeId(): Promise<number> {
    const [globalCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_counter")],
      program.programId
    );

    try {
      const counter = await program.account.globalCounter.fetch(
        globalCounterPda
      );
      return counter.challengeCount;
    } catch {
      return 0; // First challenge
    }
  }

  let admin: Keypair;
  let participants: Keypair[];
  let challengeId;

  before(async () => {
    console.log("Setting up admin account");
    admin = Keypair.generate(); // ✅ Sets the outer variable
    participants = [];

    for (let i = 0; i <= 10; i++) {
      participants.push(Keypair.generate());
    }

    const airdropSig = await provider.connection.requestAirdrop(
      admin.publicKey,
      10 * LAMPORTS_PER_SOL
    );

    await provider.connection.confirmTransaction(airdropSig);

    const airdrops = participants.map((p) =>
      provider.connection.requestAirdrop(p.publicKey, 100 * LAMPORTS_PER_SOL)
    );
    const sigs = await Promise.all(airdrops);
    await Promise.all(
      sigs.map((sig) => provider.connection.confirmTransaction(sig))
    );

    console.log("Setup complete");
  });

  it("Admin and Participants accounts initialized", async () => {
    console.log("Admin:", admin.publicKey.toString());
    console.log("Total participants:", participants.length);
  });

  it("Create a challenge", async () => {
    challengeId = await getNextChallengeId();
    const [challengePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("challenge"),
        admin.publicKey.toBuffer(),
        Buffer.from([challengeId]),
      ],
      program.programId
    );

    const entryFee = new anchor.BN(0.3 * LAMPORTS_PER_SOL);
    const thresholdMinutes = new anchor.BN(2);
    const now = Math.floor(Date.now() / 1000);
    const tenMinutes = 10 * 60;

    const startTime = new anchor.BN(now - tenMinutes * 2); // Starts in 10 minutes

    const endTime = new anchor.BN(now - tenMinutes);

    await program.methods
      .createChallenge(
        challengeId,
        entryFee,
        thresholdMinutes,
        startTime,
        endTime
      )
      .accounts({
        creator: admin.publicKey,
        verifier: admin.publicKey,
        challenge: challengePda,
      })
      .signers([admin])
      .rpc();
    const challenge = await program.account.challenge.fetch(challengePda);
    assert.equal(challenge.id, challengeId);
    assert.equal(challenge.participantCount, 0);
    console.log("✅ Challenge created successfully");

    console.log("Create test - Admin:", admin.publicKey.toString());
    console.log("Create test - Challenge ID:", challengeId);
    console.log("Create test - Challenge PDA:", challengePda.toString());
  });

  it("Participants joins a challange", async () => {
    // Derive challenge PDA
    const [challengePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("challenge"),
        admin.publicKey.toBuffer(),
        Buffer.from([challengeId]),
      ],
      program.programId
    );
    console.log("Join test - Admin:", admin.publicKey.toString());
    console.log("Join test - Challenge ID:", challengeId);
    console.log("Join test - Challenge PDA:", challengePda.toString());
    for (const participant of participants) {
      const tx = await program.methods
        .joinChallenge()
        .accounts({ challenge: challengePda, payer: participant.publicKey })
        .signers([participant])
        .rpc();
    }

    const count = (await program.account.challenge.fetch(challengePda))
      .participantCount;

    console.log("Participant count", count);
  });

  it("End Challenge", async () => {
    const [challengePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("challenge"),
        admin.publicKey.toBuffer(),
        Buffer.from([challengeId]),
      ],
      program.programId
    );

    const tx = await program.methods
      .endChallenge()
      .accounts({ challenge: challengePda, signer: admin.publicKey })
      .signers([admin])
      .rpc();

    console.log("Challenge ended succecffullty");
  });

  it("Distribute rewards among participants", async () => {
    const [challengePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("challenge"),
        admin.publicKey.toBuffer(),
        Buffer.from([challengeId]), // Fixed: wrap in array
      ],
      program.programId
    );

    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), challengePda.toBuffer()],
      program.programId
    );

    console.log("Challenge PDA for disribution", challengePda);

    // Winners: participants at index 0, 1, 4
    const winnerIndices = [0, 1, 4];

    // Get winner participant PDAs
    const winnerParticipantPdas = winnerIndices.map((i) => {
      const [participantPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("participant"),
          challengePda.toBuffer(),
          participants[i].publicKey.toBuffer(),
        ],
        program.programId
      );

      console.log(`Participant ${i} - `, participantPda);
      return participantPda;
    });

    // Check balances BEFORE distribution
    const balancesBefore = await Promise.all(
      winnerIndices.map((i) =>
        provider.connection.getBalance(participants[i].publicKey)
      )
    );

    console.log("Balances before:");
    winnerIndices.forEach((idx, i) => {
      console.log(
        `  Winner ${idx}: ${balancesBefore[i] / LAMPORTS_PER_SOL} SOL`
      );
    });

    // Build remaining accounts as pairs: [participant_pda, user_system_account, ...]
    const remaining = winnerIndices.flatMap((idx, i) => [
      { pubkey: winnerParticipantPdas[i], isWritable: true, isSigner: false },
      {
        pubkey: participants[idx].publicKey,
        isWritable: true,
        isSigner: false,
      },
    ]);

    // Distribute rewards
    const tx = await program.methods
      .distributeRewards()
      .accounts({
        challenge: challengePda,
        verifier: admin.publicKey,
      })
      .remainingAccounts(remaining)
      .signers([admin])
      .rpc();

    console.log("✅ Rewards distributed, tx:", tx);

    // Check balances AFTER distribution
    const balancesAfter = await Promise.all(
      winnerIndices.map((i) =>
        provider.connection.getBalance(participants[i].publicKey)
      )
    );

    console.log("Balances after:");
    winnerIndices.forEach((idx, i) => {
      const gained = (balancesAfter[i] - balancesBefore[i]) / LAMPORTS_PER_SOL;
      console.log(
        `  Winner ${idx}: ${
          balancesAfter[i] / LAMPORTS_PER_SOL
        } SOL (+${gained} SOL)`
      );
    });

    // Verify each winner received money
    winnerIndices.forEach((idx, i) => {
      assert.isTrue(
        balancesAfter[i] > balancesBefore[i],
        `Winner ${idx} should have received rewards`
      );
    });

    // Verify challenge status changed to Distributed
    const challenge = await program.account.challenge.fetch(challengePda);
    assert.equal(challenge.status, 2, "Challenge status should be Distributed");

    // Calculate expected share
    const totalParticipants = challenge.participantCount;
    const entryFee = challenge.entryFee.toNumber();
    const totalPool = totalParticipants * entryFee;
    const expectedShare = totalPool / winnerIndices.length;

    console.log(`Total pool: ${totalPool / LAMPORTS_PER_SOL} SOL`);
    console.log(`Winners: ${winnerIndices.length}`);
    console.log(
      `Expected share per winner: ${expectedShare / LAMPORTS_PER_SOL} SOL`
    );

    // Verify amount is close to expected (allowing for small rounding)
    const actualGain = balancesAfter[0] - balancesBefore[0];
    assert.approximately(
      actualGain,
      expectedShare,
      1000, // Allow 1000 lamports difference for rounding
      "Reward amount should match expected share"
    );

    console.log("✅ All assertions passed!");
  });
});
