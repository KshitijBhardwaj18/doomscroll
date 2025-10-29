import { View } from "react-native";
import "../../global.css";
import { ChallengesAvailable } from "../components/screens/challenges/challengesAvailable";
import { WalletGuard } from "../components/wallet/WalletGuard";
import { PageHeader } from "../components/shared/PageHeader";

export default function ChallengesScreen() {
  return (
    <WalletGuard>
      <View className="bg-black h-full flex flex-col px-6 pt-8">
        <PageHeader title="Challenges" />
        <View className="flex-1">
          <ChallengesAvailable />
        </View>
      </View>
    </WalletGuard>
  );
}
