import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";
import { useOnboarding } from "../hooks/useOnboarding";
import { WalletGuard } from "../components/wallet/WalletGuard";
import { PageHeader } from "../components/shared/PageHeader";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <View className="bg-secondary rounded-2xl p-6 mb-4">
      <View className="flex-row items-center mb-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View className="flex-1">
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-400 text-sm mb-1"
          >
            {label}
          </Text>
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-3xl"
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const { resetOnboarding } = useOnboarding();

  // Sample data - replace with real data from your API/blockchain
  const userStats = {
    totalDoomHours: 142.5,
    challengesWon: 12,
    solanaEarned: 5.8,
    currentStreak: 7,
    totalChallenges: 18,
    successRate: 67,
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will show the onboarding flow again when you restart the app. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetOnboarding();
            Alert.alert(
              "Success",
              "Onboarding has been reset. Please restart the app."
            );
          },
        },
      ]
    );
  };

  return (
    <WalletGuard>
      <View className="flex-1 bg-black">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingTop: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <PageHeader title="Profile" />

          {/* Profile Header */}
          <View className="items-center mb-8">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full bg-lime-500 items-center justify-center mb-4">
              <Ionicons name="person" size={48} color="#000" />
            </View>

            {/* User Info */}
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-2xl mb-1"
            >
              Anonymous User
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-sm mb-4"
            >
              Member since Jan 2024
            </Text>

            {/* Edit Profile Button */}
            <TouchableOpacity
              className="bg-secondary px-6 py-2 rounded-full"
              activeOpacity={0.7}
            >
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white"
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-xl mb-4"
            >
              Your Stats
            </Text>

            {/* Main Stats */}
            <StatCard
              icon="time-outline"
              label="Total Doom Hours Saved"
              value={`${userStats.totalDoomHours}h`}
              color="#22c55e"
            />

            <StatCard
              icon="trophy"
              label="Challenges Won"
              value={userStats.challengesWon.toString()}
              color="#eab308"
            />

            <StatCard
              icon="logo-solana"
              label="Total SOL Earned"
              value={`${userStats.solanaEarned} SOL`}
              color="#a855f7"
            />

            {/* Secondary Stats Grid */}
            <View className="flex-row justify-between">
              <View className="flex-1 bg-secondary rounded-2xl p-4 mr-2">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="flame" size={20} color="#f97316" />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-xs ml-2"
                  >
                    Current Streak
                  </Text>
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-2xl"
                >
                  {userStats.currentStreak} days
                </Text>
              </View>

              <View className="flex-1 bg-secondary rounded-2xl p-4 ml-2">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-xs ml-2"
                  >
                    Success Rate
                  </Text>
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-2xl"
                >
                  {userStats.successRate}%
                </Text>
              </View>
            </View>
          </View>

          {/* Achievement Badges Section */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-xl mb-4"
            >
              Achievements
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { icon: "medal", color: "#eab308", label: "First Win" },
                { icon: "flash", color: "#f97316", label: "7 Day Streak" },
                { icon: "star", color: "#a855f7", label: "Top Performer" },
                { icon: "ribbon", color: "#3b82f6", label: "Early Adopter" },
              ].map((badge, index) => (
                <View
                  key={index}
                  className="bg-secondary rounded-2xl p-4 mr-3 mb-3 items-center"
                  style={{ width: 80 }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${badge.color}20` }}
                  >
                    <Ionicons name={badge.icon} size={24} color={badge.color} />
                  </View>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-[10px] text-center"
                  >
                    {badge.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Settings/Actions */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-xl mb-4"
            >
              Settings
            </Text>

            <TouchableOpacity
              className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons name="wallet-outline" size={24} color="#a855f7" />
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-white ml-3"
                >
                  Wallet Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#3b82f6"
                />
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-white ml-3"
                >
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#22c55e"
                />
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-white ml-3"
                >
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetOnboarding}
              className="bg-secondary rounded-2xl p-4 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh-outline" size={24} color="#f97316" />
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-white ml-3"
                >
                  Reset Onboarding
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 bg-opacity-20 border border-red-500 rounded-2xl p-4 items-center mb-8"
            activeOpacity={0.7}
          >
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-red-500"
            >
              Disconnect Wallet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </WalletGuard>
  );
}
