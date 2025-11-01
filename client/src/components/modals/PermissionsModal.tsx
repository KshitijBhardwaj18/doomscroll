import React, { useState } from "react";
import "../../global.css";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Permission {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  required: boolean;
  granted: boolean;
}

interface PermissionsModalProps {
  visible: boolean;
  onComplete: () => void;
  onRequestPermission: (permissionId: string) => Promise<boolean>;
}

export function PermissionsModal({
  visible,
  onComplete,
  onRequestPermission,
}: PermissionsModalProps) {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "usage_stats",
      icon: "stats-chart",
      title: "access usage data",
      description: "This will allow the app to track screen time and app usage statistics.",
      required: true,
      granted: false,
    },
    {
      id: "notifications",
      icon: "notifications",
      title: "send you notifications",
      description: "This will allow the app to send you notifications about challenges and reminders.",
      required: true,
      granted: false,
    },
    {
      id: "background",
      icon: "time",
      title: "run in the background",
      description: "This will allow the app to continue tracking usage when not actively in use.",
      required: true,
      granted: false,
    },
    {
      id: "overlay",
      icon: "layers",
      title: "display over other apps",
      description: "This will allow the app to show alerts and overlays while you're using other apps.",
      required: false,
      granted: false,
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  const allRequiredGranted = permissions
    .filter((p) => p.required)
    .every((p) => p.granted);

  const handleRequestPermission = async (permissionId: string) => {
    setIsRequesting(true);
    
    // Mock permission request with native Alert dialogs (for demo)
    const permission = permissions.find(p => p.id === permissionId);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Alert.alert(
          `Allow Doomscroll to ${permission?.title.toLowerCase()}?`,
          permission?.description || '',
          [
            {
              text: 'Deny',
              style: 'cancel',
              onPress: () => {
                setIsRequesting(false);
                resolve();
              }
            },
            {
              text: 'Allow',
              onPress: () => {
                // Grant permission
                setPermissions((prev) =>
                  prev.map((p) =>
                    p.id === permissionId ? { ...p, granted: true } : p
                  )
                );
                
                setIsRequesting(false);
                
                // Move to next permission
                if (currentStep < permissions.length - 1) {
                  setCurrentStep(currentStep + 1);
                }
                
                resolve();
              }
            }
          ],
          { cancelable: false }
        );
      }, 300); // Small delay to show the modal first
    });
  };

  const handleSkipOptional = () => {
    if (currentStep < permissions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (allRequiredGranted) {
      onComplete();
    }
  };

  const currentPermission = permissions[currentStep];
  const grantedCount = permissions.filter((p) => p.granted).length;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/95 justify-center items-center px-6">
        <View className="bg-secondary rounded-3xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <View className="p-6 border-b border-gray-800">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-lime-500/20 rounded-full items-center justify-center mb-3">
                <Ionicons name="shield-checkmark" size={32} color="#84cc16" />
              </View>
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-2xl text-center mb-2"
              >
                Enable Permissions
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-400 text-sm text-center"
              >
                We need a few permissions to track your progress
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="mt-4">
              <View className="flex-row justify-between mb-2">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-lime-500 text-xs"
                >
                  Step {currentStep + 1} of {permissions.length}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-xs"
                >
                  {grantedCount}/{permissions.length} granted
                </Text>
              </View>
              <View className="bg-gray-800 h-2 rounded-full overflow-hidden">
                <View
                  className="bg-lime-500 h-full rounded-full"
                  style={{
                    width: `${((currentStep + 1) / permissions.length) * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Permission Cards */}
          <ScrollView
            className="p-6"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
          >
            {/* Current Permission */}
            <View
              className="bg-black/30 rounded-2xl p-5 mb-4 border-2"
              style={{ borderColor: "#84cc16" }}
            >
              <View className="flex-row items-start mb-3">
                <View className="w-12 h-12 bg-lime-500/20 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name={currentPermission.icon}
                    size={24}
                    color="#84cc16"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-white text-lg flex-1"
                    >
                      {currentPermission.title}
                    </Text>
                    {currentPermission.required && (
                      <View className="bg-red-500/20 px-2 py-0.5 rounded-full">
                        <Text
                          style={{ fontFamily: "Poppins_600SemiBold" }}
                          className="text-red-500 text-xs"
                        >
                          Required
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-400 text-sm leading-5"
                  >
                    {currentPermission.description}
                  </Text>
                </View>
              </View>

              {currentPermission.granted ? (
                <View className="flex-row items-center justify-center bg-lime-500/10 rounded-xl p-3">
                  <Ionicons name="checkmark-circle" size={20} color="#84cc16" />
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-lime-500 text-sm ml-2"
                  >
                    Permission Granted
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleRequestPermission(currentPermission.id)}
                  disabled={isRequesting}
                  className="bg-lime-500 rounded-xl py-3 items-center"
                  activeOpacity={0.8}
                >
                  {isRequesting ? (
                    <Text
                      style={{ fontFamily: "Poppins_700Bold" }}
                      className="text-black text-base"
                    >
                      Requesting...
                    </Text>
                  ) : (
                    <Text
                      style={{ fontFamily: "Poppins_700Bold" }}
                      className="text-black text-base"
                    >
                      Grant Permission
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Other Permissions Preview */}
            <View className="space-y-2">
              {permissions.map((permission, index) => {
                if (index === currentStep) return null;
                
                return (
                  <View
                    key={permission.id}
                    className="flex-row items-center bg-gray-800/50 rounded-xl p-3"
                  >
                    <View className="w-8 h-8 bg-gray-700 rounded-lg items-center justify-center mr-3">
                      <Ionicons
                        name={permission.icon}
                        size={16}
                        color={permission.granted ? "#84cc16" : "#6b7280"}
                      />
                    </View>
                    <Text
                      style={{ fontFamily: "Poppins_500Medium" }}
                      className="text-gray-400 text-sm flex-1"
                    >
                      {permission.title}
                    </Text>
                    {permission.granted && (
                      <Ionicons name="checkmark-circle" size={16} color="#84cc16" />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Info Box */}
            <View className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
              <View className="flex-row">
                <Text className="text-2xl mr-2">💡</Text>
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-blue-400 text-sm mb-1"
                  >
                    Why do we need this?
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-blue-300 text-xs leading-4"
                  >
                    These permissions help us automatically track your social media usage so you can focus on building better habits without manual logging.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="p-6 border-t border-gray-800">
            <View className="flex-row space-x-3">
              {!currentPermission.required && (
                <TouchableOpacity
                  onPress={handleSkipOptional}
                  className="flex-1 bg-gray-800 rounded-xl py-3 items-center"
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-gray-400 text-base"
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              )}
              
              {allRequiredGranted && currentStep === permissions.length - 1 && (
                <TouchableOpacity
                  onPress={onComplete}
                  className="flex-1 bg-lime-500 rounded-xl py-3 items-center"
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ fontFamily: "Poppins_700Bold" }}
                    className="text-black text-base"
                  >
                    Get Started! 🚀
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-500 text-xs text-center mt-3"
            >
              You can change these permissions anytime in Settings
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

