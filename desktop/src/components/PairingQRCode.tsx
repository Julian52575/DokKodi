"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface PairingPayload {
  type: string;
  version: number;
  host: string;
  port: number;
  token: string;
}

export function PairingQRCode() {
  const [payload, setPayload] = useState<PairingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function generateQR() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://127.0.0.1:4242/api/v1/pairing/session",
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Impossible de générer le QR code");
      }

      const data = await response.json();

      setPayload(data);
    } catch {
      setError("Impossible de contacter le serveur EpiKodi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generateQR();
  }, []);

  if (loading) return <p>Génération du QR code...</p>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={generateQR}>Réessayer</button>
      </div>
    );
  }

  if (!payload) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <QRCodeSVG
        value={JSON.stringify(payload)}
        size={240}
        level="H"
      />

      <p>Scannez ce QR code avec EpiKodi Mobile.</p>

      <p>
        {payload.host}:{payload.port}
      </p>

      <button onClick={generateQR}>
        Régénérer le QR code
      </button>
    </div>
  );
}