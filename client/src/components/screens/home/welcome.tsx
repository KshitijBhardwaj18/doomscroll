import "../../../global.css";
import { View, Text } from "react-native";
import { WalletButton } from "../../wallet/WalletButton";
import { useUser } from "../../../contexts/UserContext";

export function Welcome() {
  const { user } = useUser();

  // Get first name from full name
  const firstName = user?.name.split(" ")[0] || "User";

  return (
    <View className="flex-row justify-between items-center mb-4">
      {/* Welcome Message */}
      <View className="flex-row items-center">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-white text-4xl"
        >
          Hi {firstName}
        </Text>
        <View className="w-3 h-3 bg-lime-500 rounded-full ml-2" />
      </View>

      {/* Wallet Button */}
      <WalletButton />
    </View>
  );
}
