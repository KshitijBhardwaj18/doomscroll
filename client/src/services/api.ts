import { useMobileWallet } from "../utils/useMobileWallet";
import { useAuthorization } from "../utils/useAuthorization";
import { useCallback } from "react";

const API_URL = "http://localhost:3000"; // TODO: Move to environment variable

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
    if (!selectedAccount) {
      throw new Error("No wallet connected");
    }

    const wallet = selectedAccount.publicKey.toBase58();
    const timestamp = Date.now();
    const message = `Sign this message to authenticate with Doomscroll.\n\nWallet: ${wallet}\nTimestamp: ${timestamp}`;

    // Sign message using mobile wallet adapter
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = await signMessage(messageBytes);
    const signature = Buffer.from(signatureBytes).toString("base64");

    return {
      wallet,
      signature,
      message,
      timestamp: timestamp.toString(),
    };
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
    if (!selectedAccount) {
      throw new Error("No wallet connected");
    }

    const wallet = selectedAccount.publicKey.toBase58();
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/api/user/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ wallet }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check user");
    }

    return response.json();
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
