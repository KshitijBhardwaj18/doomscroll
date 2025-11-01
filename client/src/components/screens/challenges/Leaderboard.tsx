import React, { useState } from "react";
import "../../../global.css";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  username: string;
  averageUsage: number;
  isCurrentUser: boolean;
  isWinner: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  doomThreshold: number;
  showAll?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  remainingCount?: number;
}

export function Leaderboard({
  entries,
  doomThreshold,
  showAll = false,
  onLoadMore,
  hasMore = false,
  remainingCount = 0,
}: LeaderboardProps) {
  const [expanded, setExpanded] = useState(showAll);

  // Show top 10 if not expanded, all if expanded
  const displayedEntries = expanded ? entries : entries.slice(0, 10);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#eab308"; // Gold
    if (rank === 2) return "#9ca3af"; // Silver
    if (rank === 3) return "#cd7f32"; // Bronze
    return "#6b7280"; // Gray
  };

  return (
    <View className="mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">🏆</Text>
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-xl"
          >
            Live Leaderboard
          </Text>
        </View>
        {entries.some((e) => !e.isWinner) && (
          <View className="px-3 py-1 bg-red-500/20 rounded-full">
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-red-500 text-xs"
            >
              Over Limit
            </Text>
          </View>
        )}
      </View>

      {/* Leaderboard Container */}
      <View className="bg-secondary rounded-2xl overflow-hidden">
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ maxHeight: expanded ? 600 : 400 }}
        >
          {displayedEntries.map((entry, index) => {
            const rankIcon = getRankIcon(entry.rank);
            const rankColor = getRankColor(entry.rank);
            const isOverLimit = entry.averageUsage > doomThreshold;

            return (
              <View
                key={`${entry.wallet}-${entry.rank}`}
                className={`flex-row items-center p-4 ${
                  index !== displayedEntries.length - 1
                    ? "border-b border-gray-800"
                    : ""
                }`}
                style={
                  entry.isCurrentUser
                    ? {
                        backgroundColor: "#2a2a1a",
                        borderLeftWidth: 3,
                        borderLeftColor: "#84cc16",
                      }
                    : {}
                }
              >
                {/* Rank */}
                <View className="w-10 items-center">
                  {rankIcon ? (
                    <Text className="text-2xl">{rankIcon}</Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        color: rankColor,
                      }}
                      className="text-base"
                    >
                      {entry.rank}
                    </Text>
                  )}
                </View>

                {/* User Info */}
                <View className="flex-1 ml-3">
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className={`text-sm mb-0.5 ${
                      entry.isCurrentUser ? "text-lime-500" : "text-white"
                    }`}
                  >
                    {entry.username}
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-500 text-xs"
                  >
                    {entry.wallet}
                  </Text>
                </View>

                {/* Usage Time */}
                <View className="items-end">
                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                      color: isOverLimit ? "#ef4444" : "#84cc16",
                    }}
                    className="text-lg"
                  >
                    {entry.averageUsage}m
                  </Text>
                  <View className="flex-row items-center mt-0.5">
                    <Text className="text-base mr-1">
                      {isOverLimit ? "❌" : "✅"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Load More Button */}
          {hasMore && expanded && (
            <TouchableOpacity
              onPress={onLoadMore}
              className="p-4 items-center border-t border-gray-800"
              activeOpacity={0.7}
            >
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-lime-500 text-sm"
              >
                Load More ({remainingCount} remaining)
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Expand/Collapse Button */}
        {entries.length > 10 && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            className="p-3 items-center border-t border-gray-800 bg-black/30"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-lime-500 text-sm mr-2"
              >
                {expanded ? "Show Less" : `View All (${entries.length})`}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#84cc16"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

