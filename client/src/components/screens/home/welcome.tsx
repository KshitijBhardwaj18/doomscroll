import "../../../global.css";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Welcome() {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center">
        <Text className="text-white text-4xl font-bold">Hi Tyler</Text>
        <View className="w-3 h-3 bg-lime-500 rounded-full ml-2" />
      </View>

      {/* Settings Button */}
      <TouchableOpacity className="bg-gray-800 rounded-full p-3">
        <Ionicons name="settings-outline" size={24} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
}
