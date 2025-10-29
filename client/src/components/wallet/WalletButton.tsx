import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";
import { ellipsify } from "../../utils/ellipsify";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";

export function WalletButton() {
  const { selectedAccount } = useAuthorization();
  const { connect, disconnect } = useMobileWallet();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleCopyAddress = async () => {
    if (selectedAccount) {
      await Clipboard.setStringAsync(selectedAccount.publicKey.toBase58());
      setMenuVisible(false);
    }
  };

  const handleDisconnect = async () => {
    setMenuVisible(false);
    await disconnect();
  };

  if (!selectedAccount) {
    // Show Connect Button
    return (
      <TouchableOpacity
        onPress={connect}
        className="flex-row items-center bg-lime-500 rounded-full px-4 py-2"
        activeOpacity={0.8}
      >
        <Ionicons name="wallet" size={18} color="#000" />
        <Text
          style={{ fontFamily: "Poppins_600SemiBold" }}
          className="text-black text-sm ml-2"
        >
          Connect
        </Text>
      </TouchableOpacity>
    );
  }

  // Show Connected Wallet Address with Menu
  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="flex-row items-center bg-gray-800 rounded-full px-4 py-2"
        activeOpacity={0.8}
      >
        <View className="w-2 h-2 bg-lime-500 rounded-full mr-2" />
        <Text
          style={{ fontFamily: "Poppins_500Medium" }}
          className="text-white text-sm"
        >
          {ellipsify(selectedAccount.publicKey.toBase58(), 4)}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color="#9ca3af"
          className="ml-1"
        />
      </TouchableOpacity>

      {/* Wallet Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* Wallet Address */}
            <View className="px-4 py-3 border-b border-gray-700">
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
                {ellipsify(selectedAccount.publicKey.toBase58(), 6)}
              </Text>
            </View>

            {/* Menu Items */}
            <TouchableOpacity
              onPress={handleCopyAddress}
              className="flex-row items-center px-4 py-3 active:bg-gray-700"
            >
              <Ionicons name="copy-outline" size={20} color="#9ca3af" />
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-white text-sm ml-3"
              >
                Copy Address
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDisconnect}
              className="flex-row items-center px-4 py-3 active:bg-gray-700"
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-red-500 text-sm ml-3"
              >
                Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
