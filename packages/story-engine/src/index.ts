import type {
  AdventureTheme,
  AiTurn,
  EducationalQuestion,
  MagicalEvent,
  PlayerState,
  StoryScene,
  StorySummary
} from "@storyfox/types";

const WHISTLE_PHRASES = [
  "blow the whistle",
  "i whistle",
  "use my whistle",
  "use the whistle",
  "whistle"
];

const MAGICAL_EVENTS: MagicalEvent[] = [
  "friendly-fox",
  "rainbow",
  "fireflies",
  "butterflies",
  "magic-flowers",
  "hidden-bridge"
];

const QUESTION: EducationalQuestion = {
  id: "whistle-use",
  topic: "village-life",
  prompt: "What is a whistle used for?",
  answers: ["loud sound", "call help", "get attention", "signal", "warn"],
  choices: [
    {
      id: "correct",
      label: "To make a loud sound or call for help",
      spokenPhrases: ["loud sound", "call for help", "get attention", "signal"]
    },
    { id: "food", label: "To eat food", spokenPhrases: ["eat", "food"] },
    { id: "paint", label: "To paint pictures", spokenPhrases: ["paint", "pictures"] }
  ],
  hints: [
    "Think about the sound a whistle makes. Can people hear it from far away?",
    "A whistle is small, but it makes a loud sound when someone blows it.",
    "People use whistles to call someone, get attention, warn others, or ask for help."
  ],
  explanation:
    "A whistle is used to make a loud sound. It can call someone, get attention, warn others, or signal for help."
};

const ADVENTURE_TITLES: Record<AdventureTheme, string> = {
  "magical-village": "The Magical Whistle Ride",
  "rainbow-forest": "The Rainbow Forest Ride",
  "river-rescue": "The River Song Ride",
  "shape-castle": "The Shape Castle Ride"
};

export class StoryEngine {
  private readonly scenes: StoryScene[];
  private state: PlayerState;
  private currentSceneIndex = 0;
  private hintCount = 0;

  constructor(theme: AdventureTheme = "magical-village", playerName = "Explorer") {
    this.state = {
      playerName,
      ageRange: "7-8",
      theme,
      inventory: ["magical whistle"],
      completedQuestions: [],
      visitedLocations: [],
      companion: "Milo",
      stars: 0,
      progress: 0,
      usedMagicalEvents: []
    };
    this.scenes = this.createScenes(theme);
  }

  getState(): PlayerState {
    return structuredClone(this.state);
  }

  getCurrentScene(): StoryScene {
    return this.scenes[this.currentSceneIndex];
  }

  start(): AiTurn[] {
    const scene = this.getCurrentScene();
    this.visit(scene.location);
    return [
      { role: "narrator", text: scene.narration },
      { role: "sidekick", text: scene.sidekickLine }
    ];
  }

  handlePlayerSpeech(input: string): AiTurn[] {
    const normalized = input.toLowerCase();
    if (this.isWhistleIntent(normalized)) {
      return this.triggerWhistle();
    }

    const scene = this.getCurrentScene();
    if (scene.question) {
      return this.answerQuestion(scene.question, normalized);
    }

    return this.advance();
  }

  triggerWhistle(): AiTurn[] {
    const event = MAGICAL_EVENTS.find((item) => !this.state.usedMagicalEvents.includes(item));
    if (!event) {
      return [{ role: "sidekick", text: "The whistle sparkles softly, but waits for a new adventure." }];
    }

    this.state.usedMagicalEvents.push(event);
    const eventLine = this.magicalEventLine(event);
    return [
      { role: "narrator", text: "[SFX: whistle] The magical whistle sings across the path." },
      { role: "narrator", text: eventLine },
      ...this.advance()
    ];
  }

  getSummary(): StorySummary {
    return {
      title: ADVENTURE_TITLES[this.state.theme],
      stars: this.state.stars,
      learned: [QUESTION.explanation],
      magicalEvents: this.state.usedMagicalEvents,
      completedQuestions: this.state.completedQuestions
    };
  }

  private answerQuestion(question: EducationalQuestion, normalized: string): AiTurn[] {
    const isCorrect = question.answers.some((answer) => normalized.includes(answer));
    if (isCorrect || normalized.trim() === "a" || normalized.includes("option a")) {
      this.hintCount = 0;
      if (!this.state.completedQuestions.includes(question.id)) {
        this.state.completedQuestions.push(question.id);
        this.state.stars += 1;
      }
      return [
        {
          role: "sidekick",
          text: "Yes! A whistle can call someone, get attention, or ask for help. You earned a star."
        },
        ...this.advance()
      ];
    }

    const hint = question.hints[this.hintCount];
    this.hintCount += 1;

    if (hint) {
      return [{ role: "helper", text: hint }];
    }

    this.hintCount = 0;
    return [{ role: "helper", text: question.explanation }, ...this.advance()];
  }

  private advance(): AiTurn[] {
    this.currentSceneIndex = Math.min(this.currentSceneIndex + 1, this.scenes.length - 1);
    this.state.progress = Math.round((this.currentSceneIndex / (this.scenes.length - 1)) * 100);
    const scene = this.getCurrentScene();
    this.visit(scene.location);
    return [
      { role: "narrator", text: scene.narration },
      { role: "sidekick", text: scene.sidekickLine }
    ];
  }

  private createScenes(theme: AdventureTheme): StoryScene[] {
    return [
      {
        id: "village-start",
        title: "Village Start",
        location: "Grandma's Village",
        narration:
          "Welcome to StoryFox. You are riding a tiny wooden cart through Grandma's sunny village. The path bends toward a glowing forest gate.",
        sidekickLine:
          "I'm Milo, your sidekick. I packed courage, snacks, and one very magical whistle.",
        choices: [
          { id: "go", label: "Ride to the forest gate", spokenPhrases: ["go", "ride", "forest"] }
        ]
      },
      {
        id: "forest-gate",
        title: "Forest Gate",
        location: "Whisperwood Gate",
        narration:
          "The cart stops beside a wooden sign. It says, blow the whistle to open the forest track.",
        sidekickLine: "That sign is very confident. Try saying, blow the whistle.",
        choices: [
          {
            id: "whistle",
            label: "Blow the whistle",
            spokenPhrases: ["blow the whistle", "i whistle", "use my whistle"]
          }
        ]
      },
      {
        id: "fox-question",
        title: "The Fox Question",
        location: "Fox Bend",
        narration:
          "A friendly fox in a blue scarf hops onto the track and smiles. Before the gate opens, the fox asks one question.",
        sidekickLine: "Tiny object, big sound. I think you know this one.",
        choices: QUESTION.choices,
        question: QUESTION
      },
      {
        id: "finish",
        title: "Starry Finish",
        location: "Firefly Tunnel",
        narration:
          "The gate opens. Your cart rolls through a tunnel of warm lights, soft music, and floating fireflies. [MUSIC: village] [SFX: birds]",
        sidekickLine:
          "Adventure complete. You listened, answered, and helped the whistle do its job.",
        choices: []
      }
    ].map((scene) => ({ ...scene, title: `${ADVENTURE_TITLES[theme]}: ${scene.title}` }));
  }

  private isWhistleIntent(normalized: string): boolean {
    return WHISTLE_PHRASES.some((phrase) => normalized.includes(phrase));
  }

  private magicalEventLine(event: MagicalEvent): string {
    const lines: Record<MagicalEvent, string> = {
      "friendly-fox": "[SFX: fox] A friendly fox in a blue scarf appears on the track.",
      rainbow: "A bright rainbow bridge curves over the forest gate.",
      fireflies: "Fireflies swirl into a glowing arrow that points forward.",
      butterflies: "Butterflies flutter beside the cart like colorful flags.",
      "magic-flowers": "Magic flowers bloom along the track and light the way.",
      "hidden-bridge": "A hidden wooden bridge rises gently from the grass."
    };
    return lines[event];
  }

  private visit(location: string): void {
    if (!this.state.visitedLocations.includes(location)) {
      this.state.visitedLocations.push(location);
    }
  }
}
