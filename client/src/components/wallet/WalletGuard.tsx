import { ReactNode } from "react";
import { ConnectWalletPrompt } from "./ConnectWalletPrompt";
import { useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";

interface WalletGuardProps {
  children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { selectedAccount } = useAuthorization();
  const { connect } = useMobileWallet();

  if (!selectedAccount) {
    return <ConnectWalletPrompt onConnect={connect} />;
  }

  return <>{children}</>;
}
