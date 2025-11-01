import React, { useState, useEffect } from "react";
import "../../global.css";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClaimRewardsModalProps {
  visible: boolean;
  onClose: () => void;
  onClaim: () => Promise<void>;
  rewardAmount: string;
  challengeTitle: string;
  rank: number;
  totalParticipants: number;
}

type ClaimStatus = "idle" | "claiming" | "success" | "error";

export function ClaimRewardsModal({
  visible,
  onClose,
  onClaim,
  rewardAmount,
  challengeTitle,
  rank,
  totalParticipants,
}: ClaimRewardsModalProps) {
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confettiAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible && claimStatus === "idle") {
      // Trigger confetti animation
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, claimStatus]);

  const handleClaim = async () => {
    setClaimStatus("claiming");
    setErrorMessage("");

    try {
      await onClaim();
      setClaimStatus("success");

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: any) {
      setClaimStatus("error");
      setErrorMessage(
        error.message || "Failed to claim rewards. Please try again."
      );
    }
  };

  const handleClose = () => {
    setClaimStatus("idle");
    setErrorMessage("");
    onClose();
  };

  const confettiOpacity = confettiAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const confettiTranslateY = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/90 justify-center items-center px-6">
        <TouchableOpacity
          activeOpacity={1}
          className="bg-secondary rounded-3xl w-full max-w-md overflow-hidden"
        >
          {/* Confetti Effect */}
          <Animated.View
            className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center"
            style={{
              opacity: confettiOpacity,
              transform: [{ translateY: confettiTranslateY }],
            }}
            pointerEvents="none"
          >
            <Text className="text-6xl">🎉</Text>
          </Animated.View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full items-center justify-center z-10"
            disabled={claimStatus === "claiming"}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>

          {/* Content */}
          <View className="p-8">
            {claimStatus === "idle" && (
              <>
                {/* Trophy Icon */}
                <View className="items-center mb-6">
                  <View className="w-24 h-24 bg-yellow-500/20 rounded-full items-center justify-center mb-4">
                    <Text className="text-6xl">🏆</Text>
                  </View>
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-white text-3xl text-center mb-2"
                  >
                    Congratulations!
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-center text-sm"
                  >
                    You've completed the challenge
                  </Text>
                </View>

                {/* Challenge Info */}
                <View className="bg-black/30 rounded-2xl p-5 mb-6">
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-white text-lg mb-3"
                  >
                    {challengeTitle}
                  </Text>

                  <View className="flex-row justify-between mb-2">
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-gray-400 text-sm"
                    >
                      Your Rank
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-lime-500 text-sm"
                    >
                      #{rank} of {totalParticipants}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-gray-400 text-sm"
                    >
                      Status
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="mr-1">✅</Text>
                      <Text
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                        className="text-lime-500 text-sm"
                      >
                        Winner
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Reward Amount */}
                <View className="bg-yellow-500/10 border-2 border-yellow-500 rounded-2xl p-6 mb-6 items-center">
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-yellow-500 text-sm mb-2"
                  >
                    Your Reward
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-yellow-500 text-5xl mb-1"
                  >
                    {rewardAmount}
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-yellow-500/70 text-xs"
                  >
                    Will be transferred to your wallet
                  </Text>
                </View>

                {/* Claim Button */}
                <TouchableOpacity
                  onPress={handleClaim}
                  className="bg-yellow-500 rounded-full py-4 items-center mb-3"
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-black text-lg"
                  >
                    Claim Rewards
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-xs text-center"
                >
                  💡 Rewards will be sent to your connected wallet
                </Text>
              </>
            )}

            {claimStatus === "claiming" && (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#eab308" />
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-xl mt-6 mb-2"
                >
                  Processing...
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm text-center"
                >
                  Claiming your rewards from the blockchain
                </Text>
              </View>
            )}

            {claimStatus === "success" && (
              <View className="items-center py-8">
                <View className="w-20 h-20 bg-lime-500/20 rounded-full items-center justify-center mb-4">
                  <Ionicons name="checkmark-circle" size={60} color="#84cc16" />
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-2xl mb-2"
                >
                  Success!
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm text-center mb-4"
                >
                  {rewardAmount} has been transferred to your wallet
                </Text>
                <View className="bg-lime-500/10 rounded-xl p-4 w-full">
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-lime-500 text-xs text-center"
                  >
                    🎉 Congratulations on building better habits!
                  </Text>
                </View>
              </View>
            )}

            {claimStatus === "error" && (
              <View className="items-center py-8">
                <View className="w-20 h-20 bg-red-500/20 rounded-full items-center justify-center mb-4">
                  <Ionicons name="close-circle" size={60} color="#ef4444" />
                </View>
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-2xl mb-2"
                >
                  Claim Failed
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm text-center mb-6"
                >
                  {errorMessage}
                </Text>
                <TouchableOpacity
                  onPress={handleClaim}
                  className="bg-lime-500 rounded-full py-3 px-8"
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-black text-base"
                  >
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
