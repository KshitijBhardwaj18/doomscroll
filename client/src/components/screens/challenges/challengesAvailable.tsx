import "../../../global.css";
import {
  ScrollView,
  ImageSourcePropType,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ChallengeCard, ChallengeStatus, UserChallengeStatus } from "./challengeCard";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

interface Challenge {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType | string;
  participants: number;
  entryFee: string;
  doomThreshold: number;
  startTime: Date;
  endTime: Date;
  status: ChallengeStatus;
  userStatus: UserChallengeStatus;
  currentUsage?: number;
  userRank?: number;
  totalPool?: string;
}

interface ChallengesAvailableProps {
  challenges?: Challenge[];
}

export function ChallengesAvailable({ challenges }: ChallengesAvailableProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "joined" | "upcoming"
  >("joined");
  const navigation = useNavigation();

  // Default sample data with new structure
  const defaultChallenges: Challenge[] = [
    {
      id: "1",
      title: "7-Day Social Media Detox",
      description:
        "Limit your social media usage to 60 minutes per day. Break free from doomscrolling and reclaim your time!",
      image: require("../../../../assets/challenges/1.jpg"),
      participants: 124,
      entryFee: "0.5 SOL",
      doomThreshold: 60,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Started 2 days ago
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Ends in 5 days
      status: 'active',
      userStatus: 'joined',
      currentUsage: 45,
      userRank: 12,
      totalPool: "62 SOL",
    },
    {
      id: "2",
      title: "Weekend Warrior Challenge",
      description:
        "Stay under 30 minutes of social media per day this weekend. Perfect for beginners!",
      image: require("../../../../assets/challenges/2.jpg"),
      participants: 89,
      entryFee: "0.3 SOL",
      doomThreshold: 30,
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Starts in 2 days
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Ends in 4 days
      status: 'upcoming',
      userStatus: 'not_joined',
    },
    {
      id: "3",
      title: "30-Day Digital Wellness",
      description:
        "The ultimate challenge: Keep your social media usage under 90 minutes daily for a full month. Transform your habits!",
      image: require("../../../../assets/challenges/3.jpg"),
      participants: 56,
      entryFee: "1.0 SOL",
      doomThreshold: 90,
      startTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // Started 25 days ago
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Ended yesterday
      status: 'ended',
      userStatus: 'won',
      currentUsage: 75,
      userRank: 3,
      totalPool: "56 SOL",
    },
    {
      id: "4",
      title: "Midweek Reset Challenge",
      description:
        "A quick 3-day challenge to reset your scrolling habits. Stay under 45 minutes per day!",
      image: require("../../../../assets/challenges/4.jpg"),
      participants: 203,
      entryFee: "0.2 SOL",
      doomThreshold: 45,
      startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'ended',
      userStatus: 'lost',
      currentUsage: 65,
      totalPool: "40.6 SOL",
    },
    {
      id: "5",
      title: "Extreme Focus Challenge",
      description:
        "For the dedicated: Keep social media under 15 minutes per day for 2 weeks. High risk, high reward!",
      image: require("../../../../assets/challenges/5.jpg"),
      participants: 34,
      entryFee: "2.0 SOL",
      doomThreshold: 15,
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      userStatus: 'not_joined',
    },
  ];

  const challengeList = challenges || defaultChallenges;

  // Filter challenges based on selected filter
  const filteredChallenges = challengeList.filter((challenge) => {
    if (selectedFilter === "joined") {
      return challenge.userStatus === 'joined' || challenge.userStatus === 'won' || challenge.userStatus === 'lost' || challenge.userStatus === 'pending';
    }
    if (selectedFilter === "upcoming") {
      return challenge.userStatus === 'not_joined';
    }
    return true; // "all" shows everything
  });

  const handleJoin = (challengeId: string) => {
    console.log(`Joining challenge: ${challengeId}`);
    // TODO: Implement join challenge logic
  };

  const handleChallengePress = (challengeId: string) => {
    console.log(`Opening challenge details: ${challengeId}`);
    (navigation as any).navigate('ChallengeDetail', { challengeId });
  };

  return (
    <View className="flex-1">
      {/* Filter Tabs */}
      <View className="flex-row mb-4 bg-secondary rounded-2xl p-1">
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
      </View>

      {/* Challenge List */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              description={challenge.description}
              image={challenge.image}
              participants={challenge.participants}
              entryFee={challenge.entryFee}
              doomThreshold={challenge.doomThreshold}
              startTime={challenge.startTime}
              endTime={challenge.endTime}
              status={challenge.status}
              userStatus={challenge.userStatus}
              currentUsage={challenge.currentUsage}
              userRank={challenge.userRank}
              totalPool={challenge.totalPool}
              onPress={() => handleChallengePress(challenge.id)}
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
