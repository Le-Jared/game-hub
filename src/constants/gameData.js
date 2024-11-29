export const memoryCards = [
  { id: 1, emoji: '🐶', matched: false },
  { id: 2, emoji: '🐱', matched: false },
  { id: 3, emoji: '🐭', matched: false },
  { id: 4, emoji: '🐹', matched: false },
  { id: 5, emoji: '🐰', matched: false },
  { id: 6, emoji: '🦊', matched: false },
  { id: 7, emoji: '🐻', matched: false },
  { id: 8, emoji: '🐼', matched: false },
];


export const GAME_MODES = {
  CASUAL: 'casual',
  COMPETITIVE: 'competitive'
};

export const INSTRUCTIONS = {
  [GAME_MODES.CASUAL]: {
    title: "Casual Mode",
    rules: [
      "Find groups of 4 related words",
      "No time limit",
      "No penalties for wrong guesses",
      "Can skip freely to new groups"
    ]
  },
  [GAME_MODES.COMPETITIVE]: {
    title: "Competitive Mode",
    rules: [
      "5 minutes to solve as many groups as possible",
      "-10 points for wrong guesses",
      "-50 points and -30 seconds for skipping",
      "Points per correct group = (TimeLeft ÷ 8) + 20"
    ]
  }
};

export const difficulties = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const gameStatus = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};
