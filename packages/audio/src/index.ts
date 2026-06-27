import { clamp } from "@storyfox/utils";

export type AudioTag = "whistle" | "birds" | "fox" | "river" | "village";
export type SpokenRole = "narrator" | "sidekick" | "helper" | "player";

const TAG_PATTERN = /\[(SFX|MUSIC):\s*([a-z-]+)\]/gi;

export function extractAudioTags(text: string): { cleanText: string; tags: AudioTag[] } {
  const tags = new Set<AudioTag>();
  const cleanText = text.replace(TAG_PATTERN, (_match, _kind, rawName: string) => {
    if (isAudioTag(rawName)) {
      tags.add(rawName);
    }
    return "";
  });

  return { cleanText: cleanText.replace(/\s{2,}/g, " ").trim(), tags: [...tags] };
}

export class AudioManager {
  private readonly sounds = new Map<AudioTag, HTMLAudioElement>();
  private audioContext?: AudioContext;
  private currentSpeechAudio?: HTMLAudioElement;
  private speechQueue: Promise<void> = Promise.resolve();
  private muted = false;
  private volume = 0.8;

  constructor(
    private readonly assetBase = "/audio",
    private readonly ttsEndpoint = "/api/tts"
  ) {}

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.sounds.forEach((audio) => {
      audio.muted = muted;
    });
  }

  setVolume(volume: number): void {
    this.volume = clamp(volume, 0, 1);
    this.sounds.forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  async unlock(): Promise<void> {
    if (this.muted || typeof window === "undefined") return;
    const context = await this.getAudioContext();
    const gain = context.createGain();
    const oscillator = context.createOscillator();
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.02);
  }

  async play(tag: AudioTag, options: { loop?: boolean; fadeMs?: number } = {}): Promise<void> {
    if (this.muted) return;

    const playedAsset = await this.playAsset(tag, options);
    if (!playedAsset) {
      await this.playGeneratedSound(tag);
    }
  }

  async stop(tag: AudioTag, fadeMs = 0): Promise<void> {
    const audio = this.sounds.get(tag);
    if (!audio) return;
    if (fadeMs > 0) {
      await this.fade(tag, 0, fadeMs);
    }
    audio.pause();
    audio.currentTime = 0;
  }

  async crossfade(from: AudioTag, to: AudioTag, ms = 600): Promise<void> {
    await Promise.all([this.stop(from, ms), this.play(to, { loop: true, fadeMs: ms })]);
  }

  async playFromText(text: string): Promise<string> {
    const { cleanText, tags } = extractAudioTags(text);
    for (const tag of tags) {
      await this.play(tag, { loop: tag === "village", fadeMs: tag === "village" ? 500 : 0 });
    }
    return cleanText;
  }

  async speak(text: string, role: SpokenRole = "narrator"): Promise<void> {
    if (this.muted || typeof window === "undefined") {
      return;
    }

    const { cleanText } = extractAudioTags(text);
    if (!cleanText || role === "player") return;

    const playedRemote = await this.playRemoteSpeech(cleanText, role);
    if (playedRemote || !("speechSynthesis" in window)) {
      return;
    }

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = role === "sidekick" ? 1.08 : 0.96;
      utterance.pitch = role === "sidekick" ? 1.25 : role === "helper" ? 1.08 : 1;
      utterance.volume = this.volume;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeech(): void {
    this.currentSpeechAudio?.pause();
    this.currentSpeechAudio = undefined;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  playTurn(text: string, role: SpokenRole = "narrator"): string {
    const { cleanText, tags } = extractAudioTags(text);
    this.speechQueue = this.speechQueue
      .then(async () => {
        for (const tag of tags) {
          await this.play(tag, { loop: tag === "village", fadeMs: tag === "village" ? 500 : 0 });
        }
        await this.speak(cleanText, role);
      })
      .catch(() => undefined);
    return cleanText;
  }

  private async playAsset(tag: AudioTag, options: { loop?: boolean; fadeMs?: number }): Promise<boolean> {
    const audio = this.getAudio(tag);
    audio.loop = Boolean(options.loop);
    audio.muted = this.muted;
    audio.volume = options.fadeMs ? 0 : this.volume;

    try {
      await audio.play();
      if (options.fadeMs) {
        await this.fade(tag, this.volume, options.fadeMs);
      }
      return true;
    } catch {
      return false;
    }
  }

  private async playRemoteSpeech(text: string, role: SpokenRole): Promise<boolean> {
    try {
      const response = await fetch(this.ttsEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, role })
      });

      if (!response.ok) return false;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.muted = this.muted;
      this.currentSpeechAudio = audio;

      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        void audio.play().catch(() => {
          URL.revokeObjectURL(url);
          resolve();
        });
      });

      return true;
    } catch {
      return false;
    }
  }

  private async playGeneratedSound(tag: AudioTag): Promise<void> {
    const context = await this.getAudioContext();
    const now = context.currentTime;

    if (tag === "whistle") {
      this.tone(context, now, 880, 1320, 0.42, "sine");
      return;
    }

    if (tag === "fox") {
      this.tone(context, now, 420, 260, 0.18, "triangle");
      this.tone(context, now + 0.16, 520, 320, 0.18, "triangle");
      return;
    }

    if (tag === "birds") {
      [0, 0.12, 0.25, 0.38].forEach((offset, index) => {
        this.tone(context, now + offset, 1400 + index * 180, 1900 + index * 160, 0.08, "sine");
      });
      return;
    }

    if (tag === "river") {
      [0, 0.08, 0.16, 0.24, 0.32].forEach((offset) => {
        this.tone(context, now + offset, 180, 120, 0.18, "sawtooth", 0.05);
      });
      return;
    }

    [0, 0.25, 0.5].forEach((offset, index) => {
      this.tone(context, now + offset, 330 + index * 110, 440 + index * 140, 0.28, "sine", 0.06);
    });
  }

  private tone(
    context: AudioContext,
    start: number,
    fromFrequency: number,
    toFrequency: number,
    duration: number,
    type: OscillatorType,
    gainValue = 0.12
  ): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(fromFrequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(toFrequency, 1), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue * this.volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private async getAudioContext(): Promise<AudioContext> {
    this.audioContext ??= new AudioContext();
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    return this.audioContext;
  }

  private getAudio(tag: AudioTag): HTMLAudioElement {
    const existing = this.sounds.get(tag);
    if (existing) return existing;
    const audio = new Audio(`${this.assetBase}/${tag}.mp3`);
    audio.preload = "auto";
    audio.volume = this.volume;
    this.sounds.set(tag, audio);
    return audio;
  }

  private fade(tag: AudioTag, target: number, ms: number): Promise<void> {
    const audio = this.getAudio(tag);
    const start = audio.volume;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const frame = (now: number) => {
        const progress = clamp((now - startTime) / ms, 0, 1);
        audio.volume = start + (target - start) * progress;
        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });
  }
}

function isAudioTag(value: string): value is AudioTag {
  return ["whistle", "birds", "fox", "river", "village"].includes(value);
}
