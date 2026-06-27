import { NextResponse } from "next/server";
import { z } from "zod";
import { createStoryRoomToken } from "@/lib/livekit";

const BodySchema = z.object({
  identity: z.string().min(2).max(40),
  roomName: z.string().min(2).max(80)
});

export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token request." }, { status: 400 });
  }

  try {
    const token = await createStoryRoomToken(parsed.data.identity, parsed.data.roomName);
    return NextResponse.json({
      token,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create token.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
