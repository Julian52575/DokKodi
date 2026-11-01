import * as SecureStore from "expo-secure-store";

const CONNECTION_KEY = "epikodi_connection";

export interface DesktopConnection {
  host: string;
  port: number;
  accessToken: string;
}

export async function saveConnection(
  connection: DesktopConnection
) {
  await SecureStore.setItemAsync(
    CONNECTION_KEY,
    JSON.stringify(connection)
  );
}

export async function getConnection(): Promise<DesktopConnection | null> {
  const value = await SecureStore.getItemAsync(CONNECTION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as DesktopConnection;
  } catch {
    await SecureStore.deleteItemAsync(CONNECTION_KEY);
    return null;
  }
}

export async function removeConnection() {
  await SecureStore.deleteItemAsync(CONNECTION_KEY);
}