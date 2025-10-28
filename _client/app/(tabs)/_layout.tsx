import { Tabs } from "expo-router";
import React from "react";

const _Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "home", headerShown: false }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Compete", headerShown: false }}
      />

      <Tabs.Screen
        name="saved"
        options={{ title: "Saved", headerShown: false }}
      />
    </Tabs>
  );
};

export default _Layout;
