import React, { useState } from "react";
import "../../global.css";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportScreenTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ScreenTimeData) => void;
  doomThreshold: number;
  challengeTitle: string;
}

export interface ScreenTimeData {
  instagram: number;
  twitter: number;
  reddit: number;
  tiktok: number;
  total: number;
}

const socialMediaApps = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
  { key: 'twitter', label: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
  { key: 'reddit', label: 'Reddit', icon: 'logo-reddit', color: '#FF4500' },
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', color: '#00F2EA' },
];

export function ReportScreenTimeModal({
  visible,
  onClose,
  onSubmit,
  doomThreshold,
  challengeTitle,
}: ReportScreenTimeModalProps) {
  const [screenTime, setScreenTime] = useState({
    instagram: '',
    twitter: '',
    reddit: '',
    tiktok: '',
  });

  const calculateTotal = () => {
    return Object.values(screenTime).reduce((sum, val) => {
      const num = parseInt(val) || 0;
      return sum + num;
    }, 0);
  };

  const total = calculateTotal();
  const isOverLimit = total > doomThreshold;
  const isValid = total > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const data: ScreenTimeData = {
      instagram: parseInt(screenTime.instagram) || 0,
      twitter: parseInt(screenTime.twitter) || 0,
      reddit: parseInt(screenTime.reddit) || 0,
      tiktok: parseInt(screenTime.tiktok) || 0,
      total,
    };

    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    setScreenTime({
      instagram: '',
      twitter: '',
      reddit: '',
      tiktok: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1 bg-black/80 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-secondary rounded-t-3xl"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="p-6 border-b border-gray-800">
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-white text-2xl"
                  >
                    Report Screen Time
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-400 text-sm"
                >
                  {challengeTitle}
                </Text>
              </View>

              {/* Input Fields */}
              <View className="p-6">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-base mb-4"
                >
                  Enter today's usage (in minutes)
                </Text>

                {socialMediaApps.map((app) => (
                  <View key={app.key} className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Ionicons 
                        name={app.icon as any} 
                        size={20} 
                        color={app.color} 
                      />
                      <Text
                        style={{ fontFamily: "Poppins_500Medium" }}
                        className="text-white text-base ml-2"
                      >
                        {app.label}
                      </Text>
                    </View>
                    <View className="bg-black/30 rounded-xl border border-gray-700 flex-row items-center px-4">
                      <TextInput
                        value={screenTime[app.key as keyof typeof screenTime]}
                        onChangeText={(text) => {
                          // Only allow numbers
                          const numericText = text.replace(/[^0-9]/g, '');
                          setScreenTime({ ...screenTime, [app.key]: numericText });
                        }}
                        placeholder="0"
                        placeholderTextColor="#6b7280"
                        keyboardType="numeric"
                        maxLength={3}
                        className="flex-1 text-white text-lg py-4"
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                      />
                      <Text
                        style={{ fontFamily: "Poppins_400Regular" }}
                        className="text-gray-500 text-sm"
                      >
                        minutes
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Total Display */}
                <View 
                  className="mt-4 p-5 rounded-2xl"
                  style={{ 
                    backgroundColor: isOverLimit ? '#3a1a1a' : '#1a3a1a' 
                  }}
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-white text-lg"
                    >
                      Total Usage
                    </Text>
                    <Text
                      style={{ fontFamily: "Poppins_700Bold" }}
                      className={`text-3xl ${isOverLimit ? 'text-red-500' : 'text-lime-500'}`}
                    >
                      {total}m
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View className="bg-black/30 h-2 rounded-full overflow-hidden mb-3">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((total / doomThreshold) * 100, 100)}%`,
                        backgroundColor: isOverLimit ? '#ef4444' : '#84cc16',
                      }}
                    />
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text
                      style={{ fontFamily: "Poppins_400Regular" }}
                      className="text-gray-400 text-sm"
                    >
                      Doom Limit: {doomThreshold}m
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-lg mr-1">
                        {isOverLimit ? '⚠️' : '✅'}
                      </Text>
                      <Text
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                        className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-lime-500'}`}
                      >
                        {isOverLimit 
                          ? `${total - doomThreshold}m over` 
                          : `${doomThreshold - total}m remaining`
                        }
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Warning Message */}
                {isOverLimit && (
                  <View className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex-row">
                    <Text className="text-2xl mr-2">⚠️</Text>
                    <View className="flex-1">
                      <Text
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                        className="text-red-500 text-sm mb-1"
                      >
                        Over Doom Limit!
                      </Text>
                      <Text
                        style={{ fontFamily: "Poppins_400Regular" }}
                        className="text-red-400 text-xs"
                      >
                        You've exceeded the daily limit. This may affect your challenge standing.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isValid}
                  className={`mt-6 rounded-full py-4 items-center ${
                    isValid ? 'bg-lime-500' : 'bg-gray-700'
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className={`text-lg ${isValid ? 'text-black' : 'text-gray-500'}`}
                  >
                    Submit Report
                  </Text>
                </TouchableOpacity>

                {/* Info Text */}
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-xs text-center mt-4"
                >
                  💡 Tip: Be honest with your reporting. Accurate data helps you build better habits!
                </Text>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

