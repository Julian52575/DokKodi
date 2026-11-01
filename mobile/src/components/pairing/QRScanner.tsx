import { useRef, useState } from 'react';

import { View, Text, Pressable, ActivityIndicator } from 'react-native';

import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';

import { pairWithDesktop } from '@/services/api/pairing';
import { saveConnection } from '@/storage/auth';

import type { PairingPayload } from '@/services/api/types';

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Empêche plusieurs requêtes simultanées.
  const processing = useRef(false);

  async function handleScan(result: BarcodeScanningResult) {
    if (processing.current) return;

    processing.current = true;
    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      const payload = JSON.parse(result.data) as PairingPayload;

      // Validation du QR code.
      if (
        (payload.type && payload.type !== 'epikodi_pairing') ||
        !payload.version ||
        typeof payload.version !== 'number' ||
        isNaN(payload.version) ||
        payload.version !== 1 ||
        typeof payload.host !== 'string' ||
        typeof payload.port !== 'number' ||
        typeof payload.token !== 'string' ||
        !Number.isInteger(payload.port) ||
        payload.port < 1 ||
        payload.port > 65535 ||
        !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(payload.host)
      ) {
        throw new Error('QR code EpiKodi invalide.');
      }

      // Connexion au desktop.
      const response = await pairWithDesktop(payload);
      console.log("3. Réponse du desktop :", response);

      if (!response.success || !response.access_token) {
        throw new Error("L'appairage a échoué.");
      }

      // Sauvegarde sécurisée.
      await saveConnection({
        host: payload.host,
        port: payload.port,
        accessToken: response.access_token,
      });

      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');

      processing.current = false;
      setScanned(false);
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    setError(null);
    setScanned(false);
    processing.current = false;
  }

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center gap-4 bg-black">
        <Text>Autorisation caméra nécessaire.</Text>

        <Pressable className='bg-white p-4 rounded-lg' onPress={requestPermission}>
          <Text className='text-black font-bold'>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  }

  if (connected) {
    return (
      <View className="flex-1 justify-center items-center gap-4 bg-black">
        <Text className='text-green-500 font-bold'>EpiKodi Desktop connecté !</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      <View className="absolute bottom-0 w-full p-6 gap-3 bg-black/75">
        <Text className='text-white text-lg font-bold'>
            Connecter EpiKodi
        </Text>

        <Text className='text-white'>
            Scannez le QR code affiché sur votre ordinateur.
        </Text>

        {loading && <ActivityIndicator size="large" />}

        {error && (
          <>
            <Text className='text-red-500'>
                {error}
            </Text>

            <Pressable className='bg-white p-4 rounded-lg' onPress={retry}>
              <Text className='text-black font-bold'>Réessayer</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}