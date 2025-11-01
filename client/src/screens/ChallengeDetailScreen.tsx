import React, { useState } from "react";
import "../global.css";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ChallengeStatus,
  UserChallengeStatus,
} from "../components/screens/challenges/challengeCard";
import {
  Leaderboard,
  LeaderboardEntry,
} from "../components/screens/challenges/Leaderboard";

interface ChallengeDetailScreenProps {
  route: {
    params: {
      challengeId: string;
    };
  };
  navigation: any;
}

// Mock data - replace with actual API call
const getChallengeDetails = (id: string) => {
  // Map challenge IDs to their images
  const challengeImages: { [key: string]: any } = {
    "1": require("../../assets/challenges/1.jpg"),
    "2": require("../../assets/challenges/2.jpg"),
    "3": require("../../assets/challenges/3.jpg"),
    "4": require("../../assets/challenges/4.jpg"),
    "5": require("../../assets/challenges/5.jpg"),
  };

  return {
    id,
    title: "7-Day Social Media Detox",
    description:
      "Break free from the endless scroll! This challenge helps you reclaim your time by limiting social media usage to just 60 minutes per day. Join a community of focused individuals and win rewards for staying disciplined.",
    image: challengeImages[id] || challengeImages["1"],
    creator: "8Amg...vNi9",
    participants: 124,
    entryFee: "0.5 SOL",
    doomThreshold: 60,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active" as ChallengeStatus,
    userStatus: "joined" as UserChallengeStatus,
    currentUsage: 45,
    userRank: 12,
    totalPool: "62 SOL",
    duration: 7,
    rules: [
      "Track your daily social media usage across Instagram, Twitter, Reddit, and TikTok",
      "Stay under 60 minutes per day for the entire challenge period",
      "Report your screen time daily before midnight",
      "Winners split the prize pool equally",
    ],
    dailyProgress: [
      { day: 1, usage: 52, status: "success" },
      { day: 2, usage: 38, status: "success" },
      { day: 3, usage: 0, status: "pending" },
      { day: 4, usage: 0, status: "pending" },
      { day: 5, usage: 0, status: "pending" },
      { day: 6, usage: 0, status: "pending" },
      { day: 7, usage: 0, status: "pending" },
    ],
    leaderboard: [
      {
        rank: 1,
        wallet: "sam.sol",
        username: "sam.sol",
        averageUsage: 24,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 2,
        wallet: "carol.sol",
        username: "carol.sol",
        averageUsage: 26,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 3,
        wallet: "jack.sol",
        username: "jack.sol",
        averageUsage: 26,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 4,
        wallet: "nick.sol",
        username: "nick.sol",
        averageUsage: 29,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 5,
        wallet: "mary.sol",
        username: "mary.sol",
        averageUsage: 32,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 6,
        wallet: "mary.sol",
        username: "mary.sol",
        averageUsage: 36,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 7,
        wallet: "dave.sol",
        username: "dave.sol",
        averageUsage: 38,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 8,
        wallet: "eve.sol",
        username: "eve.sol",
        averageUsage: 48,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 9,
        wallet: "grace.sol",
        username: "grace.sol",
        averageUsage: 51,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 10,
        wallet: "iris.sol",
        username: "iris.sol",
        averageUsage: 52,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 11,
        wallet: "kate.sol",
        username: "kate.sol",
        averageUsage: 58,
        isCurrentUser: false,
        isWinner: true,
      },
      {
        rank: 12,
        wallet: "8Amg...vNi9",
        username: "You",
        averageUsage: 45,
        isCurrentUser: true,
        isWinner: true,
      },
      {
        rank: 13,
        wallet: "lisa.sol",
        username: "lisa.sol",
        averageUsage: 62,
        isCurrentUser: false,
        isWinner: false,
      },
      {
        rank: 14,
        wallet: "mike.sol",
        username: "mike.sol",
        averageUsage: 65,
        isCurrentUser: false,
        isWinner: false,
      },
      {
        rank: 15,
        wallet: "nina.sol",
        username: "nina.sol",
        averageUsage: 68,
        isCurrentUser: false,
        isWinner: false,
      },
    ] as LeaderboardEntry[],
  };
};

export default function ChallengeDetailScreen({
  route,
  navigation,
}: ChallengeDetailScreenProps) {
  const { challengeId } = route.params;
  const challenge = getChallengeDetails(challengeId);

  const isJoined = ["joined", "won", "lost", "pending"].includes(
    challenge.userStatus
  );
  const isActive = challenge.status === "active";
  const isEnded = challenge.status === "ended";

  return (
    <View className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image with Header */}
        <View style={styles.heroContainer}>
          <Image
            source={challenge.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            className="absolute top-12 right-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={20} color="white" />
          </TouchableOpacity>

          {/* Title Overlay */}
          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-3xl mb-2"
            >
              {challenge.title}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#a3e635" />
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-300 text-sm ml-1"
              >
                Created by {challenge.creator}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4 bg-secondary"
          contentContainerStyle={{ gap: 12 }}
        >
          <View className="bg-black/30 px-4 py-3 rounded-xl items-center min-w-[100px]">
            <Text className="text-2xl mb-1">💰</Text>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-lime-500 text-lg"
            >
              {challenge.totalPool}
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-xs"
            >
              Prize Pool
            </Text>
          </View>

          <View className="bg-black/30 px-4 py-3 rounded-xl items-center min-w-[100px]">
            <Text className="text-2xl mb-1">👥</Text>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-lg"
            >
              {challenge.participants}
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-xs"
            >
              Participants
            </Text>
          </View>

          <View className="bg-black/30 px-4 py-3 rounded-xl items-center min-w-[100px]">
            <Text className="text-2xl mb-1">⏱️</Text>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-yellow-500 text-lg"
            >
              5d 12h
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-xs"
            >
              Time Left
            </Text>
          </View>

          <View className="bg-black/30 px-4 py-3 rounded-xl items-center min-w-[100px]">
            <Text className="text-2xl mb-1">🎯</Text>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-red-500 text-lg"
            >
              {challenge.doomThreshold}m
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-xs"
            >
              Daily Limit
            </Text>
          </View>
        </ScrollView>

        {/* Main Content */}
        <View className="px-6 py-4">
          {/* Your Progress Card (if joined and active) */}
          {isJoined && isActive && (
            <View className="mb-6">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-xl mb-3"
              >
                Your Progress
              </Text>
              <View
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor:
                    challenge.currentUsage! <= challenge.doomThreshold
                      ? "#1a3a1a"
                      : "#3a1a1a",
                }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-white text-2xl"
                    >
                      {challenge.currentUsage}m / {challenge.doomThreshold}m
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-gray-400 text-sm"
                    >
                      Average daily usage
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-4xl mb-1">
                      {challenge.currentUsage! <= challenge.doomThreshold
                        ? "✅"
                        : "⚠️"}
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_700Bold" }}
                      className="text-lime-500 text-xl"
                    >
                      #{challenge.userRank}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="bg-black/30 h-2 rounded-full overflow-hidden mb-3">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((challenge.currentUsage! / challenge.doomThreshold) * 100, 100)}%`,
                      backgroundColor:
                        challenge.currentUsage! <= challenge.doomThreshold
                          ? "#84cc16"
                          : "#ef4444",
                    }}
                  />
                </View>

                <View className="flex-row justify-between">
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-xs"
                  >
                    Days completed: 2/7
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-lime-500 text-xs"
                  >
                    {challenge.doomThreshold - challenge.currentUsage!}m
                    remaining today
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Rewards Arriving Soon (if won) */}
          {isEnded && challenge.userStatus === "won" && (
            <View className="mb-6">
              <View
                className="p-6 rounded-2xl border-2"
                style={{ backgroundColor: "#2a2a1a", borderColor: "#eab308" }}
              >
                <View className="items-center mb-4">
                  <Text className="text-6xl mb-2">🏆</Text>
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-yellow-500 text-2xl mb-1"
                  >
                    Congratulations!
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-sm text-center"
                  >
                    You've successfully completed the challenge
                  </Text>
                </View>

                <View className="bg-yellow-500/10 rounded-xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-yellow-500 text-base"
                    >
                      Your Reward
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_700Bold" }}
                      className="text-yellow-500 text-2xl"
                    >
                      0.5 SOL
                    </Text>
                  </View>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-yellow-500/70 text-xs"
                  >
                    Rank #{challenge.userRank} of {challenge.participants}
                  </Text>
                </View>

                <View className="flex-row items-center justify-center bg-black/30 rounded-xl p-3">
                  <Text className="text-2xl mr-2">⏳</Text>
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-lime-500 text-sm"
                  >
                    Rewards will arrive soon
                  </Text>
                </View>

                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-xs text-center mt-3"
                >
                  💡 Rewards are automatically distributed to winners
                </Text>
              </View>
            </View>
          )}

          {/* Challenge Info */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-xl mb-3"
            >
              About This Challenge
            </Text>
            <View className="bg-secondary rounded-2xl p-5">
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-300 text-base leading-6 mb-4"
              >
                {challenge.description}
              </Text>

              <View className="flex-row justify-between py-3 border-t border-gray-700">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400"
                >
                  Entry Fee
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white"
                >
                  {challenge.entryFee}
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-t border-gray-700">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400"
                >
                  Duration
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white"
                >
                  {challenge.duration} days
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-t border-gray-700">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400"
                >
                  Start Date
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white"
                >
                  {challenge.startTime.toLocaleDateString()}
                </Text>
              </View>

              <View className="flex-row justify-between py-3 border-t border-gray-700">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400"
                >
                  End Date
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white"
                >
                  {challenge.endTime.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Challenge Rules */}
          {!isJoined && (
            <View className="mb-6">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-xl mb-3"
              >
                How to Win
              </Text>
              <View className="bg-secondary rounded-2xl p-5">
                {/* Rule bullets with green dots */}
                <View className="flex-row mb-3">
                  <View className="w-2 h-2 bg-lime-500 rounded-full mr-3 mt-2" />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-sm flex-1 leading-5"
                  >
                    Automatic tracking via screen time data
                  </Text>
                </View>
                <View className="flex-row mb-3">
                  <View className="w-2 h-2 bg-lime-500 rounded-full mr-3 mt-2" />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-sm flex-1 leading-5"
                  >
                    Winners split prize pool equally
                  </Text>
                </View>
                <View className="flex-row mb-4">
                  <View className="w-2 h-2 bg-lime-500 rounded-full mr-3 mt-2" />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-sm flex-1 leading-5"
                  >
                    Must complete all {challenge.duration} days to qualify
                  </Text>
                </View>

                {/* Tracked Apps */}
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-base mb-3"
                >
                  Tracked Apps
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <View className="flex-row items-center bg-black/30 px-3 py-2 rounded-full">
                    <View className="w-2 h-2 bg-lime-500 rounded-full mr-2" />
                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-white text-sm"
                    >
                      Instagram
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-black/30 px-3 py-2 rounded-full">
                    <View className="w-2 h-2 bg-lime-500 rounded-full mr-2" />
                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-white text-sm"
                    >
                      Twitter
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-black/30 px-3 py-2 rounded-full">
                    <View className="w-2 h-2 bg-lime-500 rounded-full mr-2" />
                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-white text-sm"
                    >
                      TikTok
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-black/30 px-3 py-2 rounded-full">
                    <View className="w-2 h-2 bg-lime-500 rounded-full mr-2" />
                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-white text-sm"
                    >
                      Reddit
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Daily Progress Calendar (if joined) */}
          {isJoined && (
            <View className="mb-6">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-xl mb-3"
              >
                Daily Tracking
              </Text>
              <View className="bg-secondary rounded-2xl p-5">
                <View className="flex-row flex-wrap justify-between">
                  {challenge.dailyProgress.map((day) => (
                    <View
                      key={day.day}
                      className="w-[13%] aspect-square rounded-xl items-center justify-center mb-3"
                      style={{
                        backgroundColor:
                          day.status === "success"
                            ? "#1a3a1a"
                            : day.status === "failed"
                              ? "#3a1a1a"
                              : "#1a1a1a",
                      }}
                    >
                      <Text
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                        className="text-gray-400 text-xs mb-1"
                      >
                        D{day.day}
                      </Text>
                      <Text className="text-lg">
                        {day.status === "success"
                          ? "✅"
                          : day.status === "failed"
                            ? "❌"
                            : "⏳"}
                      </Text>
                      {day.usage > 0 && (
                        <Text
                          style={{ fontFamily: "Poppins_400Regular" }}
                          className="text-gray-500 text-[10px]"
                        >
                          {day.usage}m
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Leaderboard Section */}
          {isJoined && (
            <>
              {isActive ? (
                <Leaderboard
                  entries={challenge.leaderboard}
                  doomThreshold={challenge.doomThreshold}
                  hasMore={true}
                  remainingCount={35}
                  onLoadMore={() => {}}
                />
              ) : (
                // Empty state for upcoming challenges
                <View className="mb-6">
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-white text-xl mb-4"
                  >
                    🏆 Leaderboard
                  </Text>
                  <View className="bg-secondary rounded-2xl p-8 items-center">
                    <View className="w-20 h-20 bg-purple-500/20 rounded-full items-center justify-center mb-4">
                      <Ionicons
                        name="trophy-outline"
                        size={40}
                        color="#a855f7"
                      />
                    </View>
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-white text-lg text-center mb-2"
                    >
                      Challenge Not Started
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-gray-400 text-center text-sm leading-5"
                    >
                      Your rankings and leaderboard will be shown here once the
                      challenge begins. Get ready to compete!
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {!isJoined && (
        <View className="px-6 py-4 bg-secondary border-t border-gray-800">
          <TouchableOpacity
            className="bg-lime-500 rounded-full py-4 items-center"
            activeOpacity={0.8}
          >
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-black text-lg"
            >
              Join Challenge • {challenge.entryFee}
            </Text>
          </TouchableOpacity>
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-500 text-xs text-center mt-2"
          >
            ⚠️ Entry fee is non-refundable
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
