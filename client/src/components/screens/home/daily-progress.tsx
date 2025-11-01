import "../../../global.css";
import { View, Text } from "react-native";

interface DailyProgressProps {
  currentMinutes?: number; // Current usage in minutes
  limitMinutes?: number; // User's doom limit in minutes
}

export function DailyProgress({ 
  currentMinutes = 125, 
  limitMinutes = 300 
}: DailyProgressProps) {
  // Calculate percentage and remaining time
  const percentage = Math.round((currentMinutes / limitMinutes) * 100);
  const remainingMinutes = limitMinutes - currentMinutes;
  const isUnderLimit = currentMinutes <= limitMinutes;
  
  // Determine colors and message based on status
  const bgColor = isUnderLimit ? "#3a4a1a" : "#4a1a1a"; // Dark green or dark red
  const progressColor = isUnderLimit ? "#84cc16" : "#ef4444"; // Lime-500 or Red-500
  const textColor = isUnderLimit ? "#84cc16" : "#ef4444";
  const emoji = isUnderLimit ? "💪" : "⚠️";
  const statusText = isUnderLimit ? "Crushing It!" : "Over Limit!";
  const statusMessage = isUnderLimit 
    ? "You're doing great today!" 
    : "Time to take a break!";
  const statusLabel = isUnderLimit ? "Safe Zone" : "Danger Zone";

  return (
    <View className="my-4">
      {/* Section Title */}
      <Text
        style={{ fontFamily: "Poppins_700Bold" }}
        className="text-white text-xl mb-3"
      >
        Doom Meter
      </Text>

      {/* Doom Meter Card */}
      <View 
        className="rounded-2xl p-5"
        style={{ backgroundColor: bgColor }}
      >
        {/* Top Row: Usage Stats and Percentage */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Check Icon and Usage */}
          <View className="flex-row items-center">
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: progressColor }}
            >
              <Text className="text-white text-xl">✓</Text>
            </View>
            <View>
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-2xl"
              >
                {currentMinutes} <Text className="text-gray-400 text-lg">/ {limitMinutes} min</Text>
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-400 text-sm"
              >
                Today's usage
              </Text>
            </View>
          </View>

          {/* Percentage */}
          <Text
            style={{ fontFamily: "Poppins_700Bold", color: textColor }}
            className="text-4xl"
          >
            {percentage}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-black/30 h-2 rounded-full overflow-hidden mb-4">
          <View
            className="h-full rounded-full"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: progressColor 
            }}
          />
        </View>

        {/* Status Message */}
        <View className="mb-3">
          <Text
            style={{ fontFamily: "Poppins_700Bold", color: textColor }}
            className="text-xl mb-1"
          >
            {emoji} {statusText}
          </Text>
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-300 text-sm"
          >
            {statusMessage}
          </Text>
        </View>

        {/* Bottom Row: Remaining Time and Status */}
        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-400 text-sm"
          >
            {isUnderLimit 
              ? `${remainingMinutes} min remaining` 
              : `${Math.abs(remainingMinutes)} min over limit`}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-lg mr-1">{isUnderLimit ? "💚" : "❤️"}</Text>
            <Text
              style={{ fontFamily: "Poppins_600SemiBold", color: textColor }}
              className="text-sm"
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
