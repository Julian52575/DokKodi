import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { removeConnection } from "@/storage/auth";

export default function SettingsScreen() {
  async function disconnect() {
    await removeConnection();
    router.replace("/");
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4">
      <Text className="text-2xl font-bold">Paramètres</Text>

      <Pressable onPress={disconnect}>
        <Text>Déconnecter le Media Center</Text>
      </Pressable>
    </SafeAreaView>
  );
}