export interface StoryFoxEnv {
  livekitUrl?: string;
  livekitApiKey?: string;
  livekitApiSecret?: string;
  openaiApiKey?: string;
  appUrl: string;
}

export function getServerEnv(source: NodeJS.ProcessEnv = process.env): StoryFoxEnv {
  return {
    appUrl: source.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    livekitUrl: source.LIVEKIT_URL ?? source.NEXT_PUBLIC_LIVEKIT_URL,
    livekitApiKey: source.LIVEKIT_API_KEY,
    livekitApiSecret: source.LIVEKIT_API_SECRET,
    openaiApiKey: source.OPENAI_API_KEY
  };
}

export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
