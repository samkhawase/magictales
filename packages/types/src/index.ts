export type StoryRole = "narrator" | "sidekick" | "helper" | "player";

export type AdventureTheme =
  | "magical-village"
  | "rainbow-forest"
  | "river-rescue"
  | "shape-castle";

export type LearningTopic =
  | "animals"
  | "nature"
  | "weather"
  | "colors"
  | "shapes"
  | "math"
  | "vocabulary"
  | "village-life";

export type MagicalEvent =
  | "friendly-fox"
  | "rainbow"
  | "fireflies"
  | "butterflies"
  | "magic-flowers"
  | "hidden-bridge";

export interface StoryChoice {
  id: string;
  label: string;
  spokenPhrases: string[];
}

export interface EducationalQuestion {
  id: string;
  topic: LearningTopic;
  prompt: string;
  answers: string[];
  choices: StoryChoice[];
  hints: string[];
  explanation: string;
}

export interface StoryScene {
  id: string;
  title: string;
  location: string;
  narration: string;
  sidekickLine: string;
  choices: StoryChoice[];
  question?: EducationalQuestion;
}

export interface PlayerState {
  playerName: string;
  ageRange: "4-6" | "7-8" | "9-10";
  theme: AdventureTheme;
  inventory: string[];
  completedQuestions: string[];
  visitedLocations: string[];
  companion: string;
  stars: number;
  progress: number;
  usedMagicalEvents: MagicalEvent[];
}

export interface StorySummary {
  title: string;
  stars: number;
  learned: string[];
  magicalEvents: MagicalEvent[];
  completedQuestions: string[];
}

export interface AiTurn {
  role: StoryRole;
  text: string;
}
