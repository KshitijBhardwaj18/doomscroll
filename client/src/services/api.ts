import { useMobileWallet } from "../utils/useMobileWallet";
import { useAuthorization } from "../utils/useAuthorization";
import { useCallback } from "react";

const API_URL = "http://10.0.2.2:3002";

import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer; // TODO: Move to environment variable

export interface User {
  id: string;
  wallet: string;
  name: string;
  email: string;
  doomscrollLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthHeaders {
  wallet: string;
  signature: string;
  message: string;
  timestamp: string;
}

/**
 * Hook to generate authentication headers using wallet signature
 */
export function useAuthHeaders() {
  const { signMessage } = useMobileWallet();
  const { selectedAccount } = useAuthorization();

  const getAuthHeaders = useCallback(async (): Promise<AuthHeaders> => {
    try {
      console.log(
        "🔑 [getAuthHeaders] Step 1: Starting auth header generation"
      );

      if (!selectedAccount) {
        throw new Error("No wallet connected");
      }
      console.log("✅ [getAuthHeaders] Step 2: Account found");

      const wallet = selectedAccount.publicKey.toBase58();
      console.log("✅ [getAuthHeaders] Step 3: Wallet address:", wallet);

      const timestamp = Date.now();
      console.log(
        "✅ [getAuthHeaders] Step 4: Timestamp generated:",
        timestamp
      );

      const message = `Sign this message to authenticate with Doomscroll.\n\nWallet: ${wallet}\nTimestamp: ${timestamp}`;
      console.log(
        "✅ [getAuthHeaders] Step 5: Message created, length:",
        message.length
      );

      console.log(
        "🔐 [getAuthHeaders] Step 6: Requesting signature from wallet..."
      );
      const messageBytes = new TextEncoder().encode(message);

      let signatureBytes: Uint8Array;
      try {
        signatureBytes = await signMessage(messageBytes);
        console.log(
          "✅ [getAuthHeaders] Step 7: Signature received, bytes length:",
          signatureBytes.length
        );
      } catch (signError: any) {
        console.error(
          "❌ [getAuthHeaders] Signature request failed:",
          signError
        );
        throw new Error(
          `Failed to sign message: ${signError.message || "User may have rejected the request or wallet is not ready"}`
        );
      }

      const signature = Buffer.from(signatureBytes).toString("base64");
      console.log(
        "✅ [getAuthHeaders] Step 8: Signature encoded to base64, length:",
        signature.length
      );

      const headers = {
        wallet,
        signature,
        message: Buffer.from(message).toString("base64"), // Base64-encode to avoid newline issues in HTTP headers
        timestamp: timestamp.toString(),
      };
      console.log(
        "✅ [getAuthHeaders] Step 9: Headers complete (message base64-encoded)!"
      );
      return headers;
    } catch (error: any) {
      console.error("❌ [getAuthHeaders] ERROR");
      console.error("   - Error type:", error.constructor?.name);
      console.error("   - Error message:", error.message);
      console.error("   - Error stack:", error.stack);
      throw error;
    }
  }, [signMessage, selectedAccount]);

  return { getAuthHeaders };
}

/**
 * Hook for user API calls
 */
export function useUserAPI() {
  const { getAuthHeaders } = useAuthHeaders();
  const { selectedAccount } = useAuthorization();

  const checkUser = useCallback(async (): Promise<{
    exists: boolean;
    user?: User;
  }> => {
    try {
      console.log("🔍 [checkUser] Step 1: Starting checkUser");

      if (!selectedAccount) {
        throw new Error("No wallet connected");
      }
      console.log("✅ [checkUser] Step 2: Wallet connected");

      const wallet = selectedAccount.publicKey.toBase58();
      console.log("✅ [checkUser] Step 3: Wallet address:", wallet);

      console.log("🔑 [checkUser] Step 4: Getting auth headers...");
      const headers = await getAuthHeaders();
      console.log("✅ [checkUser] Step 5: Headers obtained");
      console.log("   - wallet:", headers.wallet);
      console.log("   - signature length:", headers.signature?.length);
      console.log("   - message length:", headers.message?.length);
      console.log("   - timestamp:", headers.timestamp);
      console.log(
        "   - timestamp age (ms):",
        Date.now() - parseInt(headers.timestamp)
      );

      const requestBody = { wallet };
      console.log(
        "📦 [checkUser] Step 6: Request body:",
        JSON.stringify(requestBody)
      );
      console.log(
        "🌐 [checkUser] Step 7: Making fetch to:",
        `${API_URL}/api/user/check`
      );

      const response = await fetch(`${API_URL}/api/user/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          wallet: headers.wallet,
          signature: headers.signature,
          message: headers.message,
          timestamp: headers.timestamp,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("✅ [checkUser] Step 8: Fetch completed");
      console.log("   - status:", response.status);
      console.log("   - statusText:", response.statusText);
      console.log("   - ok:", response.ok);
      console.log(
        "   - headers:",
        Object.fromEntries(response.headers.entries())
      );

      const raw = await response.text();
      console.log(
        "✅ [checkUser] Step 9: Response body received, length:",
        raw.length
      );
      console.log("   - raw response:", raw);

      if (!response.ok) {
        console.error(
          "❌ [checkUser] Request failed with status:",
          response.status
        );
        let errorData;
        try {
          errorData = JSON.parse(raw);
        } catch {
          errorData = { error: raw || "Unknown error" };
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${raw}`);
      }

      const parsed = JSON.parse(raw);
      console.log("✅ [checkUser] Step 10: Success! Parsed response:", parsed);
      return parsed;
    } catch (error: any) {
      console.error("❌ [checkUser] FATAL ERROR");
      console.error("   - Error type:", error.constructor?.name);
      console.error("   - Error message:", error.message);
      console.error("   - Error stack:", error.stack);
      throw error;
    }
  }, [getAuthHeaders, selectedAccount]);

  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      doomscrollLimit: number;
    }): Promise<User> => {
      if (!selectedAccount) {
        throw new Error("No wallet connected");
      }

      const wallet = selectedAccount.publicKey.toBase58();
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          wallet,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create account");
      }

      const result = await response.json();
      return result.user;
    },
    [getAuthHeaders, selectedAccount]
  );

  const getUser = useCallback(async (): Promise<User> => {
    if (!selectedAccount) {
      throw new Error("No wallet connected");
    }

    const wallet = selectedAccount.publicKey.toBase58();
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/user/${wallet}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch user");
    }

    const result = await response.json();
    return result.user;
  }, [getAuthHeaders, selectedAccount]);

  return {
    checkUser,
    signup,
    getUser,
  };
}
