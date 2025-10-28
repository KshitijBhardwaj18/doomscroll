import React from "react";
import "../../global.css";
import { StyleSheet, View, ScrollView, Text } from "react-native";

import { Welcome } from "../components/screens/home/welcome";
import { ActivityRings } from "../components/screens/home/activity-rings";
import { DailyProgress } from "../components/screens/home/daily-progress";
import { WeeklyGraph } from "../components/screens/home/weekly-graph";
import { WeeklyProgress } from "../components/screens/home/weekly-progress";

export function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Welcome />
        <ActivityRings />
        <DailyProgress percentage={58} />
        <View>
          <Text className="text-white font-bold text-xl">Weekly Stats</Text>
        </View>
        <WeeklyGraph />
        <WeeklyProgress percentage={62} />
      </ScrollView>
    </View>
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
