import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import ChallengesScreen from "../screens/ChallengesScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { View,Text } from "react-native";


const Tab = createBottomTabNavigator();

/**
 * This is the main navigator with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 */
export function HomeNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel:false,
        tabBarStyle: {
          backgroundColor: "#000000", // Black background
          borderTopWidth: 0, // Remove top border
          elevation: 0, // Remove shadow on Android
          height: 85, // Taller tab bar
          paddingBottom: 20, // Spacing from bottom
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FFFFFF", // White for active
        tabBarInactiveTintColor: "#666666", // Grey for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Challenges":
              iconName = focused ? "trophy" : "trophy-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help-outline";
          }

          // For the home button, add a background circle when focused
          if (route.name === "Home" && focused) {
            return (
              <View className="flex items-center justify-center rounded-[2rem] p-2 px-8 bg-[##343434]">
                <Ionicons name={iconName} size={24} color={color} />
                <Text className="text-white">
                  Home
                </Text>
              </View>
            );
          }

          if (route.name === "Challenges" && focused) {
            return (
              <View className="flex items-center justify-center rounded-[2rem] p-2 px-8 bg-[##343434]">
                <Ionicons name={iconName} size={24} color={color} />
                <Text className="text-white">
                  Challenges
                </Text>
              </View>
            );
          }

          if (route.name === "Profile" && focused) {
            return (
              <View className="flex items-center justify-center rounded-[2rem] p-2 px-8 bg-[##343434]">
                <Ionicons name={iconName} size={24} color={color} />
                <Text className="text-white">
                  Profile
                </Text>
              </View>
            );
          }

          if (route.name === "Home" && focused) {
            return (
              <View className="flex items-center justify-center rounded-[2rem] p-2 px-8 bg-[##343434]">
                <Ionicons name={iconName} size={24} color={color} />
                <Text className="text-white">
                  Home
                </Text>
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}