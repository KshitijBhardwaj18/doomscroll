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
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ChallengeCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType | string;
  onJoin?: () => void;
  participants?: number;
  entryFee?: string;
  duration?: string;
  isJoined?: boolean;
}

export function ChallengeCard({
  title,
  description,
  image,
  onJoin,
  participants = 0,
  entryFee,
  duration,
  isJoined = false,
}: ChallengeCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      <View className="p-6">
        <View className="flex flex-row justify-between items-center">
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-xl mb-3"
          >
            {title}
          </Text>
          <View className="px-4 py-2 bg-secondary rounded-3xl flex flex-row  items-center justify-center">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-white "
            >
              Time Left:{" "}
            </Text>
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-accent"
            >
              23 hrs
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-400 text-base leading-6 mb-4"
        >
          {description}
        </Text>
        {/* Stats Row */}
        {(participants > 0 || entryFee || duration) && (
          <View className="flex-row justify-between mb-4">
            {participants > 0 && (
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-lime-500 mr-2" />
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm"
                >
                  {participants} participants
                </Text>
              </View>
            )}
            {entryFee && (
              <View className="flex-row items-center">
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-gray-400 text-sm"
                >
                  {entryFee}
                </Text>
              </View>
            )}
            {duration && (
              <View className="flex-row items-center">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm"
                >
                  {duration}
                </Text>
              </View>
            )}
          </View>
        )}
        {/* Join Button */}
        <TouchableOpacity
          onPress={onJoin}
          disabled={isJoined}
          className={`${
            isJoined ? "bg-gray-700" : "bg-lime-500"
          } rounded-full py-4 px-6 items-center`}
          activeOpacity={0.8}
        >
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className={`${isJoined ? "text-gray-400" : "text-black"} text-base`}
          >
            {isJoined ? "Already Joined" : "Join Challenge"}
          </Text>
        </TouchableOpacity>
      </View>
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
