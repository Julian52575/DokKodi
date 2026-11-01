import type {
  PairingPayload,
  PairingResponse,
} from "./types";

export async function pairWithDesktop(
  payload: PairingPayload
): Promise<PairingResponse> {
  const response = await fetch(
    `http://${payload.host}:${payload.port}/api/v1/pairing/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: payload.token,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("QR code expiré ou invalide.");
    }

    throw new Error("Impossible de contacter EpiKodi Desktop.");
  }

  return response.json();
}