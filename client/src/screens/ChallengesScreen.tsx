import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import "../../global.css";
import { Title } from "../components/screens/challenges/title";
export default function ChallengesScreen() {
  return (
    <>
      <View className="bg-primary h-full flex flex-col p-8">
        <Title />
      </View>
    </>
  );
}
