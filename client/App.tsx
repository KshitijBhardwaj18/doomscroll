// Polyfills
import "./src/polyfills";
import "./global.css";

import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { ConnectionProvider } from "./src/utils/ConnectionProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { AppStack } from "./src/navigators/AppNavigator"; // ✅ Import AppStack only
import { ClusterProvider } from "./src/components/cluster/cluster-data-access";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { OnboardingScreen } from "./src/screens/onboarding/OnboardingScreen";
import { useOnboarding } from "./src/hooks/useOnboarding";
import { UserProvider } from "./src/contexts/UserContext";
import { AppContent } from "./src/components/AppContent";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { isOnboarded, isLoading, completeOnboarding } = useOnboarding();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show loading while fonts or onboarding status is loading
  if (!fontsLoaded || isLoading) {
    return null;
  }

  // Show onboarding if user hasn't completed it
  if (!isOnboarded) {
    return (
      <>
        <StatusBar style="light" backgroundColor="#000000" />
        <OnboardingScreen onComplete={completeOnboarding} />
      </>
    );
  }

  // Show main app
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <ConnectionProvider config={{ commitment: "processed" }}>
          <UserProvider>
            <PaperProvider>
              <StatusBar style="light" backgroundColor="#000000" />
              <AppContent />
            </PaperProvider>
          </UserProvider>
        </ConnectionProvider>
      </ClusterProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
