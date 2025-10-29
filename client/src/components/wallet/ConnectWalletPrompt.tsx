import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";

interface ConnectWalletPromptProps {
  onConnect: () => void;
}

export function ConnectWalletPrompt({ onConnect }: ConnectWalletPromptProps) {
  return (
    <View className="flex-1 bg-black justify-center items-center px-8">
      {/* Icon Container */}
      <View
        className="w-32 h-32 rounded-full items-center justify-center mb-8"
        style={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}
      >
        <Ionicons name="wallet-outline" size={64} color="#a855f7" />
      </View>

      {/* Title */}
      <Text
        style={{ fontFamily: "Poppins_700Bold" }}
        className="text-white text-3xl text-center mb-4"
      >
        Connect Your Wallet
      </Text>

      {/* Description */}
      <Text
        style={{ fontFamily: "Poppins_400Regular" }}
        className="text-gray-400 text-center text-lg leading-7 mb-8"
      >
        Connect your Solana wallet to join challenges, track your progress, and
        earn rewards for breaking free from doomscrolling.
      </Text>

      {/* Features List */}
      <View className="w-full mb-8">
        <FeatureItem
          icon="trophy-outline"
          text="Join and win challenges"
          color="#eab308"
        />
        <FeatureItem
          icon="stats-chart-outline"
          text="Track your screen time"
          color="#3b82f6"
        />
        <FeatureItem
          icon="cash-outline"
          text="Earn SOL rewards"
          color="#22c55e"
        />
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        onPress={onConnect}
        className="w-full rounded-full py-4 px-8 items-center bg-lime-500"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          <Ionicons name="wallet" size={24} color="#000" />
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-black text-lg ml-2"
          >
            Connect Wallet
          </Text>
        </View>
      </TouchableOpacity>

      {/* Help Text */}
      <Text
        style={{ fontFamily: "Poppins_400Regular" }}
        className="text-gray-500 text-center text-sm mt-6"
      >
        We support all Solana wallets including Phantom, Solflare, and more
      </Text>
    </View>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
}

function FeatureItem({ icon, text, color }: FeatureItemProps) {
  return (
    <View className="flex-row items-center mb-4">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text
        style={{ fontFamily: "Poppins_500Medium" }}
        className="text-white text-base flex-1"
      >
        {text}
      </Text>
      <Ionicons name="checkmark-circle" size={24} color={color} />
    </View>
  );
}
