import "../../../global.css";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface ActiveChallenge {
  id: string;
  title: string;
  doomThreshold: number;
  currentUsage: number;
  daysCompleted: number;
  totalDays: number;
  rank: number;
  totalParticipants: number;
  endTime: Date;
  prizePool: string;
}

interface ChallengeProgressProps {
  activeChallenge?: ActiveChallenge;
  hasJoinedChallenges?: boolean;
}

export function ChallengeProgress({
  activeChallenge,
  hasJoinedChallenges = false,
}: ChallengeProgressProps) {
  const navigation = useNavigation();

  // No challenges joined - motivational prompt
  if (!hasJoinedChallenges) {
    return (
      <View className="my-4">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-white text-xl mb-3"
        >
          Your Challenges
        </Text>

        <View className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border-2 border-purple-500/30">
          {/* Animated Icon */}
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-purple-500/20 rounded-full items-center justify-center mb-3">
              <Text className="text-5xl">🎯</Text>
            </View>
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-white text-2xl text-center mb-2"
            >
              Ready for a Challenge?
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-sm text-center leading-5"
            >
              Join a challenge to compete with others and win rewards! 
              Put your screen time goals to the test.
            </Text>
          </View>

          {/* Benefits */}
          <View className="bg-black/30 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">💰</Text>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-sm"
              >
                Win SOL rewards
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">🏆</Text>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-sm"
              >
                Compete on leaderboards
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">📈</Text>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-sm"
              >
                Build better habits
              </Text>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Challenges')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full py-4 items-center"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-lg mr-2"
              >
                Browse Challenges
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-500 text-xs text-center mt-3"
          >
            💡 Start with easier challenges to build confidence
          </Text>
        </View>
      </View>
    );
  }

  // Has active challenge - show progress
  if (activeChallenge) {
    const isUnderLimit = activeChallenge.currentUsage <= activeChallenge.doomThreshold;
    const progressPercentage = (activeChallenge.currentUsage / activeChallenge.doomThreshold) * 100;
    const daysProgress = (activeChallenge.daysCompleted / activeChallenge.totalDays) * 100;
    
    // Calculate time remaining
    const now = new Date();
    const timeLeft = activeChallenge.endTime.getTime() - now.getTime();
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
      <View className="my-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-xl"
          >
            Active Challenge
          </Text>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Challenges')}
            activeOpacity={0.7}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-lime-500 text-sm"
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => (navigation as any).navigate('ChallengeDetail', { challengeId: activeChallenge.id })}
          activeOpacity={0.9}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: isUnderLimit ? '#1a3a1a' : '#3a1a1a' }}
        >
          {/* Header */}
          <View className="p-5 border-b border-black/30">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-3">
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-lg mb-1"
                  numberOfLines={1}
                >
                  {activeChallenge.title}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#a3e635" />
                  <Text
                    style={{ fontFamily: "Poppins_500Medium" }}
                    className="text-lime-500 text-xs ml-1"
                  >
                    {daysLeft}d {hoursLeft}h remaining
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <View className="flex-row items-center mb-1">
                  <Text className="text-2xl mr-1">🏆</Text>
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-yellow-500 text-lg"
                  >
                    #{activeChallenge.rank}
                  </Text>
                </View>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-xs"
                >
                  of {activeChallenge.totalParticipants}
                </Text>
              </View>
            </View>

            {/* Usage Stats */}
            <View className="flex-row justify-between items-center">
              <View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className={`text-3xl ${isUnderLimit ? 'text-lime-500' : 'text-red-500'}`}
                >
                  {activeChallenge.currentUsage}m
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-xs"
                >
                  of {activeChallenge.doomThreshold}m daily limit
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl mb-1">
                  {isUnderLimit ? '✅' : '⚠️'}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className={`text-xs ${isUnderLimit ? 'text-lime-500' : 'text-red-500'}`}
                >
                  {isUnderLimit ? 'On Track!' : 'Over Limit'}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mt-4">
              <View className="bg-black/30 h-2 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: isUnderLimit ? '#84cc16' : '#ef4444',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row">
            {/* Days Progress */}
            <View className="flex-1 p-4 border-r border-black/30">
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={16} color="#84cc16" />
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-xs ml-1"
                >
                  Progress
                </Text>
              </View>
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-lime-500 text-lg"
              >
                {activeChallenge.daysCompleted}/{activeChallenge.totalDays}
              </Text>
              <View className="bg-black/30 h-1.5 rounded-full overflow-hidden mt-2">
                <View
                  className="bg-lime-500 h-full rounded-full"
                  style={{ width: `${daysProgress}%` }}
                />
              </View>
            </View>

            {/* Prize Pool */}
            <View className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="wallet-outline" size={16} color="#eab308" />
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-xs ml-1"
                >
                  Prize Pool
                </Text>
              </View>
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-yellow-500 text-lg"
              >
                {activeChallenge.prizePool}
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-500 text-xs mt-1"
              >
                Split among winners
              </Text>
            </View>
          </View>

          {/* Motivational Message */}
          <View className="p-4 bg-black/20">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">
                {isUnderLimit ? '🔥' : '💪'}
              </Text>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-sm flex-1"
              >
                {isUnderLimit 
                  ? `Keep it up! You're ${activeChallenge.doomThreshold - activeChallenge.currentUsage}m under today!`
                  : `You can do this! Get back on track tomorrow!`
                }
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#84cc16" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

