import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAuthorization } from "../utils/useAuthorization";
import { useUserAPI } from "../services/api";
import { useUser } from "../contexts/UserContext";
import "../global.css";

export function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [doomscrollLimit, setDoomscrollLimit] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedAccount } = useAuthorization();
  const { signup } = useUserAPI();
  const { setUser } = useUser();

  const handleSignup = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const limitNum = parseInt(doomscrollLimit);
    if (isNaN(limitNum) || limitNum < 30 || limitNum > 300) {
      Alert.alert(
        "Error",
        "Doom scroll limit must be between 30 and 300 minutes"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        doomscrollLimit: limitNum,
      });

      setUser(user);
      Alert.alert("Success", "Account created successfully! 🎉");
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <StatusBar style="light" backgroundColor="#000000" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}
          >
            <Ionicons name="person-add" size={40} color="#a855f7" />
          </View>
          <Text
            style={{ fontFamily: "Poppins_700Bold" }}
            className="text-white text-3xl text-center mb-2"
          >
            Create Your Account
          </Text>
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-400 text-center text-base"
          >
            Complete your profile to get started
          </Text>
        </View>

        {/* Wallet Info */}
        <View className="bg-secondary rounded-2xl p-4 mb-6 flex-row items-center">
          <Ionicons name="wallet" size={20} color="#a3e635" />
          <View className="ml-3 flex-1">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-400 text-xs mb-1"
            >
              Connected Wallet
            </Text>
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-white text-sm"
            >
              {selectedAccount?.publicKey.toBase58().slice(0, 8)}...
              {selectedAccount?.publicKey.toBase58().slice(-8)}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="mb-6">
          {/* Name Input */}
          <View className="mb-4">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-white text-sm mb-2"
            >
              Full Name
            </Text>
            <View className="bg-secondary rounded-xl px-4 py-3 flex-row items-center">
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#6b7280"
                className="flex-1 ml-3 text-white"
                style={{ fontFamily: "Poppins_400Regular" }}
                autoCapitalize="words"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-white text-sm mb-2"
            >
              Email Address
            </Text>
            <View className="bg-secondary rounded-xl px-4 py-3 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#6b7280"
                className="flex-1 ml-3 text-white"
                style={{ fontFamily: "Poppins_400Regular" }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Doom Scroll Limit Input */}
          <View className="mb-4">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-white text-sm mb-2"
            >
              Daily Doom Scroll Limit (minutes)
            </Text>
            <View className="bg-secondary rounded-xl px-4 py-3 flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#9ca3af" />
              <TextInput
                value={doomscrollLimit}
                onChangeText={setDoomscrollLimit}
                placeholder="60"
                placeholderTextColor="#6b7280"
                className="flex-1 ml-3 text-white"
                style={{ fontFamily: "Poppins_400Regular" }}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-500 text-xs mt-2 ml-1"
            >
              Recommended: 30-90 minutes per day
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isSubmitting}
          className={`rounded-full py-4 px-8 items-center ${
            isSubmitting ? "bg-gray-700" : "bg-lime-500"
          }`}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="#fff" size="small" />
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-lg ml-2"
              >
                Creating Account...
              </Text>
            </View>
          ) : (
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-black text-lg"
            >
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-500 text-center text-xs mt-6"
        >
          By creating an account, you agree to join challenges and track your
          doom scrolling habits
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
