import { View, Text } from "react-native";
import "../../global.css";
import { WalletButton } from "../wallet/WalletButton";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-6">
      {/* Page Title */}
      <View className="flex-row items-center">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-white text-3xl"
        >
          {title}
        </Text>
      </View>

      {/* Wallet Button */}
      <WalletButton />
    </View>
  );
}
