import { router } from "expo-router";
import { useEffect, useState } from "react";
import {  Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getConnection } from "@/storage/auth";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getConnection().then((connection) => {
      setConnected(!!connection);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (

    <SafeAreaView className="flex-1 items-center justify-center gap-4">
      <Text className="text-3xl font-bold">EpiKodi</Text>

      {connected ? (
        <>
          <Text>Desktop associé</Text>

          <Pressable onPress={() => router.push("/settings")}>
            <Text>Paramètres</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text>Aucun Media Center associé.</Text>

          <Pressable onPress={() => router.push("/pairing")}>
            <Text>Connecter un appareil</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}