// Polyfills
import "./src/polyfills";
import "./global.css";

import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { ConnectionProvider } from "./src/utils/ConnectionProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  PaperProvider,
} from "react-native-paper";
import { AppStack } from "./src/navigators/AppNavigator"; // ✅ Import AppStack only
import { ClusterProvider } from "./src/components/cluster/cluster-data-access";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <ConnectionProvider config={{ commitment: "processed" }}>
          <PaperProvider>
          <StatusBar style="light" backgroundColor="#000000" />  
            <SafeAreaView className="bg-primary" style={styles.shell}>
              <NavigationContainer>
                <AppStack />
              </NavigationContainer>
            </SafeAreaView>
          </PaperProvider>
        </ConnectionProvider>
      </ClusterProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#000000"
  },
});
