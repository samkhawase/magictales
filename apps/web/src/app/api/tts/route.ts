import { NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(1).max(1200),
  role: z.enum(["narrator", "sidekick", "helper", "player"]).default("narrator")
});

const roleConfig = {
  narrator: {
    voice: "alloy",
    speed: 0.96,
    instructions: "Warm, magical storyteller voice for a young child. Clear, gentle, and expressive."
  },
  sidekick: {
    voice: "shimmer",
    speed: 1.05,
    instructions: "Playful animated sidekick voice. Friendly, bright, and funny, but not too fast."
  },
  helper: {
    voice: "sage",
    speed: 0.94,
    instructions: "Patient teacher voice. Calm, encouraging, and very easy to understand."
  },
  player: {
    voice: "alloy",
    speed: 1,
    instructions: "Do not narrate player text."
  }
} as const;

export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid speech request." }, { status: 400 });
  }

  if (parsed.data.role === "player") {
    return NextResponse.json({ error: "Player speech is not narrated." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is required for spoken narration." }, { status: 503 });
  }

  const config = roleConfig[parsed.data.role];
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
      input: parsed.data.text,
      voice: config.voice,
      instructions: config.instructions,
      response_format: "mp3",
      speed: config.speed
    })
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Unable to generate speech.");
    return NextResponse.json({ error: message }, { status: response.status });
  }

  return new NextResponse(response.body, {
    headers: {
      "cache-control": "no-store",
      "content-type": response.headers.get("content-type") ?? "audio/mpeg"
    }
  });
}
