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

  let admin: Keypair;
  let participants: Keypair[];

  before(async () => {
    console.log("Setting up admin account");
    admin = Keypair.generate(); // ✅ Sets the outer variable
    participants = [];

    for (let i = 0; i <= 100; i++) {
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
    const [globalCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_counter")],
      program.programId
    );

    const [challengePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("challenge"), admin.publicKey.toBuffer()],
      program.programId
    );

    const entryFee = new anchor.BN(0.3 * LAMPORTS_PER_SOL);
    const thresholdMinutes = new anchor.BN(2);
    const now = Math.floor(Date.now() / 1000);
    const tenMinutes = 10 * 60;

    const startTime = new anchor.BN(now + tenMinutes); // Starts in 10 minutes
    const endTime = new anchor.BN(now + tenMinutes * 2);

    await program.methods
      .createChallenge(entryFee, thresholdMinutes, startTime, endTime)
      .accounts({
        verifier: admin.publicKey,
      })
      .signers([admin])
      .rpc();
  });

  
});
