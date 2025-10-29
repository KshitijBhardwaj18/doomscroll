import { prisma } from "../config/database";

export interface CreateUserData {
  wallet: string;
  name: string;
  email: string;
  doomscrollLimit: number;
}

/**
 * Check if a user exists by wallet address
 */
export const checkUserExists = async (wallet: string) => {
  const user = await prisma.user.findUnique({
    where: { wallet },
  });

  return {
    exists: !!user,
    user: user || undefined,
  };
};

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserData) => {
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { wallet: data.wallet },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  // Check if email is already taken
  const emailExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (emailExists) {
    throw new Error("Email already in use");
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      wallet: data.wallet,
      name: data.name,
      email: data.email,
      doomscrollLimit: data.doomscrollLimit,
    },
  });

  return user;
};

/**
 * Get user by wallet address
 */
export const getUserByWallet = async (wallet: string) => {
  const user = await prisma.user.findUnique({
    where: { wallet },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUser = async (
  wallet: string,
  data: Partial<CreateUserData>
) => {
  const user = await prisma.user.update({
    where: { wallet },
    data,
  });

  return user;
};
