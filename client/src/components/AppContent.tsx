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
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  // Check user status when wallet connects
  useEffect(() => {
    if (selectedAccount && !hasCheckedUser) {
      checkUserStatus().then(() => {
        setHasCheckedUser(true);
      });
    } else if (!selectedAccount) {
      setHasCheckedUser(false);
    }
  }, [selectedAccount, hasCheckedUser]);

  // Show connect wallet prompt if not connected
  if (!selectedAccount) {
    return <ConnectWalletPrompt onConnect={connect} />;
  }

  // Show loading while checking user status
  if (isCheckingUser || !hasCheckedUser) {
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
    return <SignupScreen />;
  }

  // Show main app if user exists
  return (
    <SafeAreaView className="bg-primary" style={styles.shell}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
