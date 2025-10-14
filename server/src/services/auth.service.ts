import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

/**
 * Verify a message signature from a Solana wallet
 */
export const verifySignature = (
  message: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, "base64");
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

/**
 * Generate a challenge message for wallet to sign
 */
export const generateAuthMessage = (
  wallet: string,
  timestamp: number
): string => {
  return `Sign this message to authenticate with Doomscroll.\n\nWallet: ${wallet}\nTimestamp: ${timestamp}`;
};

/**
 * Validate that a timestamp is recent (within 5 minutes)
 */
export const isTimestampValid = (timestamp: number): boolean => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return Math.abs(now - timestamp) < fiveMinutes;
};
