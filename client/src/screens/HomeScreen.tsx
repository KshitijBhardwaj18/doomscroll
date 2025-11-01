import React from "react";
import "../../global.css";
import { StyleSheet, View, ScrollView, Text } from "react-native";

import { Welcome } from "../components/screens/home/welcome";
import { ActivityRings } from "../components/screens/home/activity-rings";
import { DailyProgress } from "../components/screens/home/daily-progress";
import { WeeklyGraph } from "../components/screens/home/weekly-graph";
import { WeeklyProgress } from "../components/screens/home/weekly-progress";
import { WalletGuard } from "../components/wallet/WalletGuard";
import { useUser } from "../contexts/UserContext";

export function HomeScreen() {
  const { user } = useUser();

  // Calculate total minutes from activity rings (mock data for now)
  // TODO: Replace with actual screen time data from API
  const currentMinutes = 42 + 28 + 17 + 38; // Instagram + Twitter + Reddit + TikTok = 125
  const limitMinutes = user?.doomscrollLimit || 300; // User's limit or default 300 min

  return (
    <WalletGuard>
      <View style={styles.screenContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Welcome />
          <ActivityRings />
          <DailyProgress
            currentMinutes={currentMinutes}
            limitMinutes={limitMinutes}
          />
          <View>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-xl"
            >
              Weekly Stats
            </Text>
          </View>
          <WeeklyGraph />
          <WeeklyProgress percentage={62} />
        </ScrollView>
      </View>
    </WalletGuard>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    padding: 16,
  },
});
