import { Text, View } from "react-native";
import WalletButton from "@/components/WalletButton";

export default function Index() {
  return (
    <View className="flex items-center justify-center flex-1">
      <Text className="text-5xl text-primary">Welcome!</Text>
      <View>
        <WalletButton />
      </View>
    </View>
  );
}
