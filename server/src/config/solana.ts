import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { readFileSync } from "fs";
import { env } from "./env";

// Load program IDL (you'll need to copy this from your contract build)
import idl from "../idl/doomscroll.json";

let connection: Connection;
let program: Program;
let verifierKeypair: Keypair;

export const initSolana = () => {
  // Create connection
  connection = new Connection(env.SOLANA_RPC_URL, "confirmed");

  // Load verifier keypair
  try {
    const keypairData = JSON.parse(
      readFileSync(env.VERIFIER_KEYPAIR_PATH, "utf-8")
    );
    verifierKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log(
      "✅ Verifier keypair loaded:",
      verifierKeypair.publicKey.toBase58()
    );
  } catch (error) {
    console.error("❌ Failed to load verifier keypair:", error);
    throw error;
  }

  // Create wallet
  const wallet = new Wallet(verifierKeypair);

  // Create provider
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // Initialize program
  program = new Program(idl as any, provider);

  console.log("✅ Solana initialized");
  console.log("   RPC:", env.SOLANA_RPC_URL);
  console.log("   Program ID:", program.programId.toBase58());
};

export const getConnection = (): Connection => {
  if (!connection) {
    throw new Error("Solana not initialized. Call initSolana() first.");
  }
  return connection;
};

export const getProgram = (): Program => {
  if (!program) {
    throw new Error("Program not initialized. Call initSolana() first.");
  }
  return program;
};

export const getVerifierKeypair = (): Keypair => {
  if (!verifierKeypair) {
    throw new Error(
      "Verifier keypair not initialized. Call initSolana() first."
    );
  }
  return verifierKeypair;
};
