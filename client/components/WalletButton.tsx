import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { useState, useCallback } from "react";
import { Button } from "react-native-paper";
import { useAuthorization } from "@/services/useAuthorization";
import { useMobileWallet } from "@/services/useMovileWallet";
import { alertAndLog } from "@/services/alertAndLog";

export function WalletButton() {
  const { authorizeSession } = useAuthorization();
  const { connect } = useMobileWallet();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await connect();
    } catch (err: any) {
      alertAndLog(
        "Error during connect",
        err instanceof Error ? err.message : err
      );
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizationInProgress, authorizeSession]);
  return (
    <Button
      mode="contained"
      disabled={authorizationInProgress}
      onPress={handleConnectPress}
      style={{ flex: 1 }}
      className="bg-blue-500"
    >
      Connect
    </Button>
  );
}

export default WalletButton;
