import "../../../global.css";
import {
  ScrollView,
  ImageSourcePropType,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ChallengeCard } from "./challengeCard";
import { useState } from "react";

// Import local image
const challengeImage = require("../../../../assets/challenge1.jpg");

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType | string;
  participants: number;
  entryFee: string;
  duration: string;
  isJoined: boolean;
}

interface ChallengesAvailableProps {
  challenges?: Challenge[];
}

export function ChallengesAvailable({ challenges }: ChallengesAvailableProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "joined" | "upcoming"
  >("all");

  // Default sample data
  const defaultChallenges: Challenge[] = [
    {
      id: "1",
      title: "Start a Healthy Lifestyle",
      description:
        "Walk for 30 minutes every day, drink more water, and cut back on fast food. This goal helps you feel better both physically and mentally.",
      image: challengeImage, // Local image
      participants: 124,
      entryFee: "0.5 SOL",
      duration: "7 days",
      isJoined: false,
    },
    {
      id: "2",
      title: "Digital Detox Challenge",
      description:
        "Limit your social media usage to 30 minutes per day. Spend more time reading, exercising, or connecting with friends in person.",
      image: challengeImage, // Local image
      participants: 89,
      entryFee: "0.3 SOL",
      duration: "14 days",
      isJoined: false,
    },
    {
      id: "3",
      title: "Early Bird Challenge",
      description:
        "Wake up before 6 AM every day and start your morning with meditation or exercise. Transform your mornings, transform your life.",
      image: challengeImage, // Local image
      participants: 56,
      entryFee: "0.2 SOL",
      duration: "21 days",
      isJoined: true,
    },
    {
      id: "4",
      title: "30-Day Fitness Challenge",
      description:
        "Complete a 30-minute workout every day for 30 days. Build strength, endurance, and healthy habits that last a lifetime.",
      image: challengeImage,
      participants: 203,
      entryFee: "1.0 SOL",
      duration: "30 days",
      isJoined: true,
    },
  ];

  const challengeList = challenges || defaultChallenges;

  // Filter challenges based on selected filter
  const filteredChallenges = challengeList.filter((challenge) => {
    if (selectedFilter === "joined") return challenge.isJoined;
    if (selectedFilter === "upcoming") return !challenge.isJoined;
    return true; // "all" shows everything
  });

  const handleJoin = (challengeId: string) => {
    console.log(`Joining challenge: ${challengeId}`);
    // TODO: Implement join challenge logic
  };

  return (
    <View className="flex-1">
      {/* Filter Tabs */}
      <View className="flex-row mb-4 bg-secondary rounded-2xl p-1">
        <TouchableOpacity
          onPress={() => setSelectedFilter("all")}
          className={`flex-1 py-3 rounded-xl ${
            selectedFilter === "all" ? "bg-lime-500" : "bg-transparent"
          }`}
          activeOpacity={0.7}
        >
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className={`text-center ${
              selectedFilter === "all" ? "text-black" : "text-gray-400"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedFilter("joined")}
          className={`flex-1 py-3 rounded-xl ${
            selectedFilter === "joined" ? "bg-lime-500" : "bg-transparent"
          }`}
          activeOpacity={0.7}
        >
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className={`text-center ${
              selectedFilter === "joined" ? "text-black" : "text-gray-400"
            }`}
          >
            Joined
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedFilter("upcoming")}
          className={`flex-1 py-3 rounded-xl ${
            selectedFilter === "upcoming" ? "bg-lime-500" : "bg-transparent"
          }`}
          activeOpacity={0.7}
        >
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className={`text-center ${
              selectedFilter === "upcoming" ? "text-black" : "text-gray-400"
            }`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Challenge List */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              image={challenge.image}
              participants={challenge.participants}
              entryFee={challenge.entryFee}
              duration={challenge.duration}
              isJoined={challenge.isJoined}
              onJoin={() => handleJoin(challenge.id)}
            />
          ))
        ) : (
          <View className="items-center justify-center py-12">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-gray-500 text-lg"
            >
              No {selectedFilter === "joined" ? "joined" : "upcoming"}{" "}
              challenges found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
