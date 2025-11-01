import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";
import { useOnboarding } from "../hooks/useOnboarding";
import { WalletGuard } from "../components/wallet/WalletGuard";
import { useUser } from "../contexts/UserContext";
import { useAuthorization } from "../utils/useAuthorization";

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
  const { user } = useUser();
  const { selectedAccount } = useAuthorization();

  // Demo stats - showing some activity but no challenges joined yet
  const userStats = {
    totalDoomHours: 1.5,
    challengesWon: 0,
    solanaEarned: 0,
    currentStreak: 1,
    totalChallenges: 0, // Will join during demo
    successRate: 0,
  };

  // Get user name and wallet
  const userName = user?.name || "User";
  const walletAddress = selectedAccount?.publicKey.toBase58() || "";
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "";

  // Format join date
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Just now";

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
          {/* Profile Header */}
          <View className="items-center mb-8">
            {/* Avatar with border */}
            <View className="mb-4">
              <View className="w-28 h-28 rounded-full border-4 border-lime-500 overflow-hidden">
                <Image
                  source={require("../../assets/avatar.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              {/* Online indicator */}
              <View className="absolute bottom-2 right-2 w-6 h-6 bg-lime-500 rounded-full border-4 border-black" />
            </View>

            {/* User Info */}
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-3xl mb-2"
            >
              {userName}
            </Text>

            {/* Wallet Address */}
            <TouchableOpacity
              className="flex-row items-center bg-secondary px-4 py-2 rounded-full mb-2"
              activeOpacity={0.7}
            >
              <Ionicons name="wallet-outline" size={16} color="#84cc16" />
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-lime-500 text-sm ml-2"
              >
                {shortWallet}
              </Text>
              <Ionicons
                name="copy-outline"
                size={14}
                color="#84cc16"
                className="ml-2"
              />
            </TouchableOpacity>

            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-500 text-xs mb-6"
            >
              Member since {joinDate}
            </Text>

            {/* Quick Stats Cards */}
            <View className="flex-row justify-between w-full px-4">
              <View className="bg-secondary rounded-xl p-4 items-center flex-1 mr-2">
                <View className="w-10 h-10 bg-lime-500/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trophy-outline" size={20} color="#84cc16" />
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-xl mb-0.5"
                >
                  {userStats.totalChallenges}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-xs"
                >
                  Challenges
                </Text>
              </View>

              <View className="bg-secondary rounded-xl p-4 items-center flex-1 mx-1">
                <View className="w-10 h-10 bg-yellow-500/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="medal-outline" size={20} color="#eab308" />
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-xl mb-0.5"
                >
                  {userStats.challengesWon}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-xs"
                >
                  Wins
                </Text>
              </View>

              <View className="bg-secondary rounded-xl p-4 items-center flex-1 ml-2">
                <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mb-2">
                  <Ionicons name="wallet-outline" size={20} color="#a855f7" />
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-xl mb-0.5"
                >
                  {userStats.solanaEarned}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-xs"
                >
                  SOL
                </Text>
              </View>
            </View>
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
              icon="wallet"
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

            {/* Empty state for fresh user */}
            <View className="bg-secondary rounded-2xl p-8 items-center">
              <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-4">
                <Ionicons name="trophy-outline" size={40} color="#6b7280" />
              </View>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-gray-400 text-base mb-2"
              >
                No Achievements Yet
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-500 text-sm text-center leading-5"
              >
                Complete challenges to unlock badges and achievements!
              </Text>
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
              className="text-white"
            >
              Disconnect Wallet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </WalletGuard>
  );
}
