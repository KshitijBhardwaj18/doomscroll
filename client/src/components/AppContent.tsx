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
        console.log("⏱️ [AppContent] New wallet detected, scheduling user check...");
        // Add a small delay to allow wallet adapter to fully settle after connection
        const timer = setTimeout(() => {
          console.log("⏱️ [AppContent] Starting user check now...");
          setCheckedWallet(walletAddress);
          checkUserStatus();
        }, 500); // 500ms delay to let wallet adapter settle

        return () => {
          console.log("🧹 [AppContent] Cleaning up timer");
          clearTimeout(timer);
        };
      }
    } else {
      // Wallet disconnected, reset checked wallet
      setCheckedWallet(null);
    }
  }, [selectedAccount, checkedWallet, checkUserStatus]);

  console.log("🎬 [AppContent] Render state:", {
    hasAccount: !!selectedAccount,
    isCheckingUser,
    hasUser: !!user,
    needsSignup,
  });

  // Show connect wallet prompt if not connected
  if (!selectedAccount) {
    console.log("📱 [AppContent] Showing connect wallet prompt");
    return <ConnectWalletPrompt onConnect={connect} />;
  }

  // Show loading while checking user status
  if (isCheckingUser) {
    console.log("⏳ [AppContent] Showing loading screen");
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

  // Show signup screen if user needs to sign up
  if (needsSignup && !user) {
    console.log("📝 [AppContent] Showing signup screen");
    return <SignupScreen />;
  }

  // Show main app if user exists
  if (user) {
    console.log("✅ [AppContent] Showing main app for user:", user.name);
    return (
      <SafeAreaView className="bg-primary" style={styles.shell}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </SafeAreaView>
    );
  }

  // Fallback: still loading or error state
  console.log("⚠️ [AppContent] Fallback state - showing loading");
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
