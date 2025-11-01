import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStack } from "../navigators/AppNavigator";
import { useAuthorization } from "../utils/useAuthorization";
import { useUser } from "../contexts/UserContext";
import { SignupScreen } from "../screens/SignupScreen";
import { ConnectWalletPrompt } from "./wallet/ConnectWalletPrompt";
import { useMobileWallet } from "../utils/useMobileWallet";
import { StyleSheet } from "react-native";
import "../global.css";

export function AppContent() {
  const { selectedAccount } = useAuthorization();
  const { connect } = useMobileWallet();
  const { user, isCheckingUser, needsSignup, checkUserStatus } = useUser();
  const [checkedWallet, setCheckedWallet] = React.useState<string | null>(null);

  // Check user status when wallet connects (only once per wallet)
  useEffect(() => {
    if (selectedAccount) {
      const walletAddress = selectedAccount.publicKey.toBase58();
      
      // Only check if we haven't checked this wallet yet
      if (checkedWallet !== walletAddress) {
        const timer = setTimeout(() => {
          setCheckedWallet(walletAddress);
          checkUserStatus();
        }, 500);

        return () => {
          clearTimeout(timer);
        };
      }
    } else {
      // Wallet disconnected, reset checked wallet
      setCheckedWallet(null);
    }
  }, [selectedAccount, checkedWallet, checkUserStatus]);

  if (!selectedAccount) {
    return <ConnectWalletPrompt onConnect={connect} />;
  }

  if (isCheckingUser) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#a3e635" />
        <Text
          style={{ fontFamily: "Poppins_500Medium" }}
          className="text-white text-lg mt-4"
        >
          Loading your account...
        </Text>
      </View>
    );
  }

  if (needsSignup && !user) {
    return <SignupScreen />;
  }

  if (user) {
    return (
      <SafeAreaView className="bg-primary" style={styles.shell}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <ActivityIndicator size="large" color="#a3e635" />
      <Text
        style={{ fontFamily: "Poppins_500Medium" }}
        className="text-white text-lg mt-4"
      >
        Connecting...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
