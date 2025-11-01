import React from "react";
import "../../global.css";
import { StyleSheet, View, ScrollView, Text } from "react-native";

import { Welcome } from "../components/screens/home/welcome";
import { ActivityRings } from "../components/screens/home/activity-rings";
import { DailyProgress } from "../components/screens/home/daily-progress";
import { WeeklyGraph } from "../components/screens/home/weekly-graph";
import { ChallengeProgress } from "../components/screens/home/challenge-progress";
import { WalletGuard } from "../components/wallet/WalletGuard";
import { useUser } from "../contexts/UserContext";

export function HomeScreen() {
  const { user } = useUser();

  // Demo data - showing some activity after onboarding
  const currentMinutes = 87; // Some usage today
  const limitMinutes = user?.doomscrollLimit || 60; // User's limit or default 60 min

  // Demo data - no challenges joined yet (will join during demo)
  const hasJoinedChallenges = false;
  const activeChallenge = undefined;

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
          <ChallengeProgress
            activeChallenge={activeChallenge}
            hasJoinedChallenges={hasJoinedChallenges}
          />
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
