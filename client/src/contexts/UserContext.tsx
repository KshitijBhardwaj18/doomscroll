import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuthorization } from "../utils/useAuthorization";
import { User, useUserAPI } from "../services/api";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isCheckingUser: boolean;
  needsSignup: boolean;
  error: string | null;
  checkUserStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [needsSignup, setNeedsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedAccount } = useAuthorization();
  const { checkUser, getUser } = useUserAPI();

  // Check user status when wallet connects
  const checkUserStatus = async () => {
    if (!selectedAccount) {
      setUserState(null);
      setNeedsSignup(false);
      return;
    }

    setIsCheckingUser(true);
    setError(null);

    try {
      const result = await checkUser();

      if (result.exists && result.user) {
        setUserState(result.user);
        setNeedsSignup(false);
      } else {
        setUserState(null);
        setNeedsSignup(true);
      }
    } catch (err: any) {
      setError(err.message);
      setUserState(null);
      setNeedsSignup(true);
    } finally {
      setIsCheckingUser(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!selectedAccount) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await getUser();
      setUserState(userData);
      setNeedsSignup(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Set user manually (after signup)
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      setNeedsSignup(false);
    }
  };

  // Clear user data
  const clearUser = () => {
    setUserState(null);
    setNeedsSignup(false);
    setError(null);
  };

  useEffect(() => {
    if (!selectedAccount) {
      clearUser();
    }
  }, [selectedAccount]);

  const value: UserContextType = {
    user,
    isLoading,
    isCheckingUser,
    needsSignup,
    error,
    checkUserStatus,
    setUser,
    refreshUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
