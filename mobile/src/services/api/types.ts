export interface PairingPayload {
  type: "epikodi_pairing";
  version: 1;
  host: string;
  port: number;
  token: string;
}

export interface PairingResponse {
  success: boolean;
  access_token: string;
}