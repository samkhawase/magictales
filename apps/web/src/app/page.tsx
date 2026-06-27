"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Radio, Sparkles } from "lucide-react";
import { AudioManager, extractAudioTags } from "@storyfox/audio";
import { StoryEngine } from "@storyfox/story-engine";
import type { AdventureTheme, AiTurn, StoryChoice } from "@storyfox/types";
import { AchievementCard } from "@/components/AchievementCard";
import { AdventureSummary } from "@/components/AdventureSummary";
import { AvatarPicker } from "@/components/AvatarPicker";
import { ChoiceCard } from "@/components/ChoiceCard";
import { CompanionBubble } from "@/components/CompanionBubble";
import { HintBubble } from "@/components/HintBubble";
import { LiveTranscript } from "@/components/LiveTranscript";
import { ParentDashboard } from "@/components/ParentDashboard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { StoryIllustration } from "@/components/StoryIllustration";
import { VoiceOrb } from "@/components/VoiceOrb";
import { Waveform } from "@/components/Waveform";

const themes: Array<{ id: AdventureTheme; label: string }> = [
  { id: "magical-village", label: "Magical Village" },
  { id: "rainbow-forest", label: "Rainbow Forest" },
  { id: "river-rescue", label: "River Rescue" },
  { id: "shape-castle", label: "Shape Castle" }
];

export default function HomePage() {
  const [theme, setTheme] = useState<AdventureTheme>("magical-village");
  const [avatar, setAvatar] = useState("Explorer");
  const [started, setStarted] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<AiTurn[]>([]);
  const [lastHint, setLastHint] = useState("");
  const [livekit, setLivekit] = useState<{ token: string; url: string } | null>(null);
  const audio = useMemo(() => (typeof window === "undefined" ? null : new AudioManager()), []);
  const engineRef = useRef(new StoryEngine(theme, avatar));

  const scene = engineRef.current.getCurrentScene();
  const state = engineRef.current.getState();
  const summary = engineRef.current.getSummary();
  const isComplete = state.progress === 100;

  useEffect(() => {
    audio?.setMuted(muted);
    if (muted) {
      audio?.stopSpeech();
    }
  }, [audio, muted]);

  function resetEngine(nextTheme = theme, nextAvatar = avatar) {
    engineRef.current = new StoryEngine(nextTheme, nextAvatar);
    setTurns([]);
    setLastHint("");
  }

  async function appendTurns(nextTurns: AiTurn[]) {
    const cleaned: AiTurn[] = [];
    for (const turn of nextTurns) {
      const { cleanText } = extractAudioTags(turn.text);
      audio?.playTurn(turn.text, turn.role);
      cleaned.push({ ...turn, text: cleanText || turn.text });
    }
    setTurns((current) => [...current, ...cleaned]);
    const helper = [...cleaned].reverse().find((turn: AiTurn) => turn.role === "helper");
    setLastHint(helper?.text ?? "");
  }

  async function startAdventure() {
    void audio?.unlock();
    resetEngine(theme, avatar);
    setStarted(true);
    await appendTurns(engineRef.current.start());
    await connectLiveKit();
  }

  async function connectLiveKit() {
    const roomName = `storyfox-${crypto.randomUUID()}`;
    const response = await fetch("/api/livekit-token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ identity: avatar, roomName })
    }).catch(() => null);

    if (!response?.ok) return;
    const data = (await response.json()) as { token?: string; url?: string };
    if (data.token && data.url) {
      setLivekit({ token: data.token, url: data.url });
    }
  }

  async function handleChoice(choice: StoryChoice) {
    void audio?.unlock();
    await appendTurns(engineRef.current.handlePlayerSpeech(choice.spokenPhrases[0] ?? choice.label));
  }

  async function handleVoicePress() {
    void audio?.unlock();
    setListening(true);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      await appendTurns([{ role: "helper", text: "Voice is not available in this browser. Tap a choice to keep playing." }]);
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const spoken = event.results[0]?.[0]?.transcript ?? "";
      await appendTurns([{ role: "player", text: spoken }, ...engineRef.current.handlePlayerSpeech(spoken)]);
      setListening(false);
    };
    recognition.onerror = async () => {
      await appendTurns([{ role: "helper", text: "I did not catch that. Try speaking again when the orb glows." }]);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
              <Sparkles size={18} /> StoryFox
            </p>
            <h1 className="text-4xl font-black sm:text-6xl">Voice stories kids can ride through.</h1>
          </div>
          <SettingsDialog muted={muted} onMutedChange={setMuted} />
        </header>

        {!started ? (
          <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-[32px] border border-border bg-card p-6 shadow-story">
              <StoryIllustration progress={8} />
              <div className="mt-6 grid gap-5">
                <div>
                  <h2 className="text-2xl font-black">Choose Story Theme</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {themes.map((item) => (
                      <button
                        className={`rounded-[22px] border p-4 text-left font-bold ${
                          theme === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                        }`}
                        key={item.id}
                        onClick={() => {
                          setTheme(item.id);
                          resetEngine(item.id, avatar);
                        }}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black">Pick Player</h2>
                  <div className="mt-3">
                    <AvatarPicker
                      value={avatar}
                      onChange={(value: string) => {
                        setAvatar(value);
                        resetEngine(theme, value);
                      }}
                    />
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-lg font-black text-primary-foreground shadow-story"
                  onClick={startAdventure}
                  type="button"
                >
                  <Play size={22} /> Start Voice Adventure
                </button>
              </div>
            </div>
            <div className="grid content-start gap-4">
              <AchievementCard title="Two Minute Ride" description="Short enough for young attention spans, rich enough to feel magical." />
              <AchievementCard title="No Typing" description="Children speak, listen, tap, and react naturally." />
              <AchievementCard title="Helper AI" description="Hints arrive gently when the answer is hard." />
            </div>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-5">
              <StoryIllustration progress={state.progress} />
              <div className="rounded-[28px] border border-border bg-card p-5 shadow-story">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">{scene.location}</p>
                    <h2 className="text-2xl font-black">{scene.title}</h2>
                  </div>
                  <button
                    className="grid place-items-center rounded-full focus:outline-none focus:ring-4 focus:ring-primary/30"
                    onClick={handleVoicePress}
                    type="button"
                  >
                    <VoiceOrb active={listening} muted={muted} />
                  </button>
                </div>
                <Waveform active={listening} />
                {scene.question ? (
                  <div className="mt-4 rounded-[22px] border border-amber-300 bg-amber-50 p-4 text-lg font-black text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50">
                    {scene.question.prompt}
                  </div>
                ) : null}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(scene.question?.choices ?? scene.choices).map((choice) => (
                    <ChoiceCard choice={choice} key={choice.id} onSelect={handleChoice} />
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {isComplete ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <AdventureSummary summary={summary} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <div className="grid content-start gap-4">
              {livekit ? (
                <LiveKitRoom
                  audio
                  connect
                  serverUrl={livekit.url}
                  token={livekit.token}
                  video={false}
                >
                  <div className="rounded-[24px] border border-primary/30 bg-primary/10 p-4 text-sm font-bold">
                    <Radio className="mb-2" /> Realtime room connected
                  </div>
                </LiveKitRoom>
              ) : (
                <div className="rounded-[24px] border border-border bg-card/80 p-4 text-sm text-muted-foreground">
                  Realtime voice connects after LiveKit keys are added.
                </div>
              )}
              <CompanionBubble text={scene.sidekickLine} />
              <HintBubble text={lastHint} />
              <LiveTranscript turns={turns} />
              <ParentDashboard state={state} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
