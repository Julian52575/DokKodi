import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pairing" options={{ title: 'Connexion à EpiKodi',headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Paramètres',headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
