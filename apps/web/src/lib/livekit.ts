import { AccessToken } from "livekit-server-sdk";
import { getServerEnv, requireEnv } from "@storyfox/config";

export async function createStoryRoomToken(identity: string, roomName: string): Promise<string> {
  const env = getServerEnv();
  const apiKey = requireEnv("LIVEKIT_API_KEY", env.livekitApiKey);
  const apiSecret = requireEnv("LIVEKIT_API_SECRET", env.livekitApiSecret);
  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: identity,
    ttl: "15m"
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true
  });

  return token.toJwt();
}
