import "dotenv/config";
import { getServerEnv, requireEnv } from "@storyfox/config";
import { StoryEngine } from "@storyfox/story-engine";
import { STORYFOX_SYSTEM_PROMPT } from "./prompts";

const env = getServerEnv();

requireEnv("LIVEKIT_URL", env.livekitUrl);
requireEnv("LIVEKIT_API_KEY", env.livekitApiKey);
requireEnv("LIVEKIT_API_SECRET", env.livekitApiSecret);
requireEnv("OPENAI_API_KEY", env.openaiApiKey);

async function main() {
  const agents = await import("@livekit/agents");
  const openai = await import("@livekit/agents-plugin-openai");
  const silero = await import("@livekit/agents-plugin-silero");

  const defineAgent = (agents as any).defineAgent;
  const cli = (agents as any).cli;
  const WorkerOptions = (agents as any).WorkerOptions;
  const VoicePipelineAgent = (agents as any).VoicePipelineAgent;

  const entry = defineAgent({
    prewarm: async (proc: any) => {
      proc.userData.vad = await (silero as any).VAD.load();
    },
    entry: async (ctx: any) => {
      const engine = new StoryEngine("magical-village", "Explorer");
      const initialTurns = engine.start().map((turn) => `${turn.role}: ${turn.text}`).join("\n");

      const agent = new VoicePipelineAgent({
        vad: ctx.proc.userData.vad,
        stt: new (openai as any).STT({ model: "gpt-4o-transcribe" }),
        llm: new (openai as any).LLM({
          model: "gpt-5-realtime",
          instructions: `${STORYFOX_SYSTEM_PROMPT}\n\nCurrent story state:\n${initialTurns}`
        }),
        tts: new (openai as any).TTS({ model: "gpt-4o-mini-tts", voice: "alloy" })
      });

      await ctx.connect();
      agent.start(ctx.room);
      await agent.say("Narrator: Welcome to StoryFox. Your magical whistle is ready. Say, blow the whistle, when you want the ride to begin.");
    }
  });

  cli.runApp(new WorkerOptions({ agent: entry }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
