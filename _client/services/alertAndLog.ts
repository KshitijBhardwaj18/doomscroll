import { timeoutManager } from "@tanstack/react-query";
import { Alert } from "react-native";

export function alertAndLog(title: string, message: any) {
  setTimeout(async () => {
     Alert.alert(title, message, [{ text: "OK", style: "cancel" }]);
  }, 100);

  console.log(message)
}


