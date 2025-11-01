import "../../../global.css";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export type ChallengeStatus = 'upcoming' | 'active' | 'ended';
export type UserChallengeStatus = 'not_joined' | 'joined' | 'won' | 'lost' | 'pending';

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType | string;
  participants?: number;
  entryFee?: string;
  doomThreshold?: number;
  startTime: Date;
  endTime: Date;
  status: ChallengeStatus;
  userStatus?: UserChallengeStatus;
  currentUsage?: number; // User's current average usage (if joined)
  userRank?: number; // User's current rank (if joined)
  totalPool?: string;
  onPress?: () => void;
  onJoin?: () => void;
}

export function ChallengeCard({
  id,
  title,
  description,
  image,
  participants = 0,
  entryFee,
  doomThreshold,
  startTime,
  endTime,
  status,
  userStatus = 'not_joined',
  currentUsage,
  userRank,
  totalPool,
  onPress,
  onJoin,
}: ChallengeCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = status === 'upcoming' ? startTime : endTime;
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return status === 'upcoming' ? 'Starting soon' : 'Ended';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  // Determine badge info based on status
  const getBadgeInfo = () => {
    if (status === 'ended') {
      if (userStatus === 'won') {
        return { emoji: '🏆', text: 'Winner!', color: '#eab308' };
      } else if (userStatus === 'lost') {
        return { emoji: '❌', text: 'Failed', color: '#ef4444' };
      } else if (userStatus === 'pending') {
        return { emoji: '⏱️', text: 'Calculating...', color: '#eab308' };
      } else {
        return { emoji: '📊', text: 'Completed', color: '#6b7280' };
      }
    } else if (status === 'active') {
      if (userStatus === 'joined') {
        return { emoji: '✅', text: 'Joined', color: '#22c55e' };
      }
      return { emoji: '🔥', text: 'Active', color: '#84cc16' };
    } else {
      return { emoji: '🕐', text: 'Upcoming', color: '#eab308' };
    }
  };

  // Determine button info
  const getButtonInfo = () => {
    if (status === 'ended') {
      if (userStatus === 'won') {
        return { text: 'View Rewards', color: '#eab308', enabled: true };
      } else if (userStatus === 'joined' || userStatus === 'lost' || userStatus === 'pending') {
        return { text: 'View Results', color: '#6b7280', enabled: true };
      } else {
        return { text: 'View Details', color: '#6b7280', enabled: true };
      }
    } else if (userStatus === 'joined') {
      return { text: 'View Details', color: '#8b5cf6', enabled: true };
    } else {
      return { text: 'Join Challenge', color: '#84cc16', enabled: status !== 'ended' };
    }
  };

  const badgeInfo = getBadgeInfo();
  const buttonInfo = getButtonInfo();
  const isJoined = userStatus === 'joined' || userStatus === 'won' || userStatus === 'lost' || userStatus === 'pending';

  return (
    <View className="bg-secondary rounded-3xl overflow-hidden mb-4">
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {!imageError ? (
          <>
            {typeof image === "string" ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <Image
                source={image}
                style={styles.image}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a3e635" />
              </View>
            )}
          </>
        ) : (
          // Fallback placeholder when image fails to load
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={60} color="#666" />
            <Text style={styles.placeholderText}>Image unavailable</Text>
          </View>
        )}
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
      </View>

      {/* Content Section */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress}
        className="p-6"
      >
        {/* Header Row: Title and Status Badge */}
        <View className="flex-row justify-between items-start mb-3">
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-xl flex-1 mr-2"
            numberOfLines={2}
          >
            {title}
          </Text>
          <View 
            className="px-3 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: badgeInfo.color + '20' }}
          >
            <Text className="text-sm mr-1">{badgeInfo.emoji}</Text>
            <Text
              style={{ fontFamily: "Poppins_600SemiBold", color: badgeInfo.color }}
              className="text-xs"
            >
              {badgeInfo.text}
            </Text>
          </View>
        </View>

        {/* Time Left Badge */}
        {status !== 'ended' && (
          <View className="mb-3">
            <View className="px-4 py-2 bg-black/30 rounded-2xl flex-row items-center self-start">
              <Ionicons name="time-outline" size={16} color="#a3e635" />
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-white ml-2 text-sm"
              >
                {status === 'upcoming' ? 'Starts in: ' : 'Ends in: '}
              </Text>
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-lime-500 text-sm"
              >
                {timeLeft}
              </Text>
            </View>
          </View>
        )}

        {/* User Progress (if joined and active) */}
        {isJoined && status === 'active' && currentUsage !== undefined && doomThreshold && (
          <View 
            className="mb-4 p-3 rounded-xl"
            style={{ backgroundColor: currentUsage <= doomThreshold ? '#1a3a1a' : '#3a1a1a' }}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-base"
                >
                  Your Progress
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-xs"
                >
                  Avg: {currentUsage}/{doomThreshold} min/day
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-2xl mr-1">
                  {currentUsage <= doomThreshold ? '✅' : '⚠️'}
                </Text>
                {userRank && (
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-lime-500 text-lg"
                  >
                    #{userRank}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-400 text-sm leading-5 mb-4"
          numberOfLines={2}
        >
          {description}
        </Text>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-4 flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons name="people-outline" size={16} color="#84cc16" />
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-sm ml-1"
            >
              {participants} joined
            </Text>
          </View>
          
          {entryFee && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons name="wallet-outline" size={16} color="#eab308" />
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-gray-400 text-sm ml-1"
              >
                {entryFee}
              </Text>
            </View>
          )}
          
          {doomThreshold && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="timer-outline" size={16} color="#ef4444" />
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-400 text-sm ml-1"
              >
                {doomThreshold} min/day
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            if (userStatus === 'not_joined' && onJoin) {
              onJoin();
            } else if (onPress) {
              onPress();
            }
          }}
          disabled={!buttonInfo.enabled}
          className="rounded-full py-4 px-6 items-center"
          style={{ backgroundColor: buttonInfo.color }}
          activeOpacity={0.8}
        >
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className={`${userStatus === 'won' ? 'text-black' : 'text-white'} text-base`}
          >
            {buttonInfo.text}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    backgroundColor: "#1a1a1a", // Dark background while loading
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  placeholderText: {
    color: "#666",
    marginTop: 10,
    fontSize: 14,
  },
});
