import "../../../global.css";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SocialMediaApp {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  minutes: number; // Minutes scrolled
  maxMinutes: number; // Maximum/goal time (for calculating progress)
  color: string;
}

interface ActivityRingsProps {
  apps?: SocialMediaApp[];
}

export function ActivityRings({ apps }: ActivityRingsProps) {
  // Default data - can be overridden via props
  const defaultApps: SocialMediaApp[] = [
    {
      icon: "logo-instagram",
      label: "Instagram",
      minutes: 45,
      maxMinutes: 60,
      color: "#E4405F", // Instagram pink
    },
    {
      icon: "logo-twitter",
      label: "Twitter",
      minutes: 32,
      maxMinutes: 60,
      color: "#1DA1F2", // Twitter blue
    },
    {
      icon: "logo-reddit",
      label: "Reddit",
      minutes: 28,
      maxMinutes: 60,
      color: "#FF4500", // Reddit orange
    },
    {
      icon: "logo-tiktok",
      label: "TikTok",
      minutes: 52,
      maxMinutes: 60,
      color: "#00F2EA", // TikTok cyan
    },
  ];

  const socialApps = apps || defaultApps;

  // Calculate progress percentage
  const getProgress = (minutes: number, maxMinutes: number) => {
    return (minutes / maxMinutes) * 100;
  };

  return (
    <View className="flex-row justify-around py-4">
      {socialApps.map((app, index) => {
        const progress = getProgress(app.minutes, app.maxMinutes);

        return (
          <View key={index} className="items-center">
            {/* Ring Container */}
            <View className="relative w-16 h-16 items-center justify-center mb-2">
              {/* Background Ring */}
              <View
                className="absolute w-16 h-16 rounded-full border-4"
                style={{ borderColor: "#2a2a2a" }}
              />
              {/* Progress Ring */}
              <View
                className="absolute w-16 h-16 rounded-full border-4"
                style={{
                  borderColor: app.color,
                  borderTopColor: progress > 0 ? app.color : "transparent",
                  borderRightColor: progress > 25 ? app.color : "transparent",
                  borderBottomColor: progress > 50 ? app.color : "transparent",
                  borderLeftColor: progress > 75 ? app.color : "transparent",
                  transform: [{ rotate: "-90deg" }],
                }}
              />
              {/* App Icon */}
              <Ionicons name={app.icon} size={28} color={app.color} />
            </View>
            {/* Label and Minutes */}
            <Text className="text-xs font-semibold text-white mb-0.5">
              {app.minutes}m
            </Text>
            <Text className="text-[10px] text-gray-500">{app.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
