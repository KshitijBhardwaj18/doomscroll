// Type definitions for the server

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthHeaders {
  wallet: string;
  signature: string;
  message: string;
  timestamp: string;
}

export interface ScreenTimeSubmission {
  challenge_id: string;
  social_media_minutes: number;
  app_breakdown?: Record<string, number>;
  timestamp: number;
}

export interface Winner {
  wallet: string;
  participantPda: string;
  walletAddress: string;
  totalMinutes: number;
}

export interface LeaderboardEntry {
  wallet: string;
  totalMinutes: number;
  disqualified: boolean;
  joinedAt: Date;
}
