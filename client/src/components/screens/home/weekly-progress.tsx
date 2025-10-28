import "../../../global.css";
import { View, Text } from "react-native";

interface WeeklyProgressProps {
  percentage?: number;
  complete?: number;
  inProgress?: number;
  incomplete?: number;
}

export function WeeklyProgress({
  percentage = 62,
  complete = 40,
  inProgress = 35,
  incomplete = 25,
}: WeeklyProgressProps) {
  const size = 120;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment lengths
  const completeLength = (complete / 100) * circumference;
  const inProgressLength = (inProgress / 100) * circumference;
  const incompleteLength = (incomplete / 100) * circumference;

  return (
    <View className="bg-secondary rounded-2xl p-6 my-4">
      <View className="flex-row items-center">
        {/* Simple Progress Circle using borders */}
        <View
          className="mr-6 items-center justify-center"
          style={{ width: size, height: size }}
        >
          {/* Outer ring with gradient effect using multiple layers */}
          <View
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderColor: "#2a2a2a",
            }}
          />

          {/* Green segment (complete) */}
          <View
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderTopColor: "#22c55e",
              borderRightColor: complete > 25 ? "#22c55e" : "transparent",
              borderBottomColor: complete > 50 ? "#22c55e" : "transparent",
              borderLeftColor: complete > 75 ? "#22c55e" : "transparent",
              transform: [{ rotate: "-90deg" }],
            }}
          />

          {/* Yellow segment (in progress) */}
          <View
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderTopColor: inProgress > 0 ? "#eab308" : "transparent",
              borderRightColor:
                complete + inProgress > 25 ? "#eab308" : "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              transform: [{ rotate: `${(complete / 100) * 360 - 90}deg` }],
            }}
          />

          {/* Red segment (incomplete) */}
          <View
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderTopColor: incomplete > 0 ? "#ef4444" : "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              transform: [
                { rotate: `${((complete + inProgress) / 100) * 360 - 90}deg` },
              ],
            }}
          />

          {/* Percentage in center */}
          <View
            className="absolute items-center justify-center"
            style={{ width: size, height: size }}
          >
            <Text className="text-white text-3xl font-bold">{percentage}%</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-1">
          <Text className="text-white text-xl font-bold mb-4">
            Weekly progress
          </Text>

          <View className="space-y-2">
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 rounded-full bg-lime-500 mr-2" />
              <Text className="text-lime-500 text-sm">Complete</Text>
            </View>

            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-yellow-500 text-sm">In progress</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-red-500 mr-2" />
              <Text className="text-red-500 text-sm">Incomplete</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
