import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
  SOLANA_RPC_URL: z.string(),
  SOLANA_NETWORK: z.enum(["devnet", "testnet", "mainnet-beta"]),
  PROGRAM_ID: z.string(),
  VERIFIER_KEYPAIR_PATH: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    console.error(error);
    process.exit(1);
  }
};

export const env = parseEnv();
