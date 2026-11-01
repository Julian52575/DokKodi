import QRScanner from '@/components/pairing/QRScanner';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PairingScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <QRScanner />;
    </SafeAreaView>
  );
}
