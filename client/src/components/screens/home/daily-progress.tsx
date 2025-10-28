import "../../../global.css";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DailyProgressProps {
  percentage?: number;
}

export function DailyProgress({ percentage = 58 }: DailyProgressProps) {
  return (
    <View className="bg-blue-500 rounded-2xl p-5 my-4 flex-row items-center justify-between">
      {/* Icon */}
      <View className="bg-blue-400 rounded-xl p-3">
        <Ionicons name="calendar" size={28} color="white" />
      </View>

      {/* Progress Info */}
      <View className="flex-1 mx-4">
        <Text className="text-white text-xl font-bold mb-2">
          Daily Progress
        </Text>
        {/* Progress Bar */}
        <View className="bg-blue-400 h-3 rounded-full overflow-hidden">
          <View
            className="bg-lime-400 h-full rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </View>
      </View>

      {/* Percentage */}
      <Text className="text-white text-2xl font-bold">{percentage}%</Text>
    </View>
  );
}
