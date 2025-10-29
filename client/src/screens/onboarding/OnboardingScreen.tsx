import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface OnboardingPage {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

const pages: OnboardingPage[] = [
  {
    icon: "phone-portrait-outline",
    title: "Break Free from Doomscrolling",
    description:
      "Take control of your screen time and build healthier digital habits with gamified challenges.",
    color: "#22c55e",
  },
  {
    icon: "trophy-outline",
    title: "Join Challenges, Win Rewards",
    description:
      "Compete with others to reduce social media usage. Stay under the limit and earn SOL tokens!",
    color: "#eab308",
  },
  {
    icon: "stats-chart-outline",
    title: "Track Your Progress",
    description:
      "Monitor your daily screen time across Instagram, Twitter, Reddit, and TikTok in real-time.",
    color: "#3b82f6",
  },
  {
    icon: "wallet-outline",
    title: "Connect Your Wallet",
    description:
      "Use your Solana wallet to join challenges, stake entry fees, and collect your winnings.",
    color: "#a855f7",
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollX.value = withSpring((currentPage - 1) * width);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Skip Button */}
      <View className="flex-row justify-between items-center px-6 pt-12">
        {currentPage > 0 ? (
          <TouchableOpacity onPress={handlePrevious} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#9ca3af" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <TouchableOpacity onPress={handleSkip} className="p-2">
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className="text-gray-400 text-base"
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Icon */}
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
          style={{
            backgroundColor: `${pages[currentPage].color}20`,
          }}
        >
          <Ionicons
            name={pages[currentPage].icon}
            size={64}
            color={pages[currentPage].color}
          />
        </View>

        {/* Title */}
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-white text-3xl text-center mb-6"
        >
          {pages[currentPage].title}
        </Text>

        {/* Description */}
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-400 text-center text-lg leading-7"
        >
          {pages[currentPage].description}
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="px-8 pb-12">
        {/* Dots Indicator */}
        <View className="flex-row justify-center mb-8">
          {pages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentPage ? "w-8 bg-lime-500" : "w-2 bg-gray-700"
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-lime-500 rounded-full py-4 px-8 items-center"
          activeOpacity={0.8}
        >
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-black text-lg"
          >
            {currentPage === pages.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Progress Text */}
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-500 text-center mt-4"
        >
          {currentPage + 1} of {pages.length}
        </Text>
      </View>
    </View>
  );
}
