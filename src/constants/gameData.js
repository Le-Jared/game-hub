// Memory Game Data
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

export const wordsList = [
  { word: 'REACT', hint: 'A JavaScript library for building user interfaces' },
  { word: 'JAVASCRIPT', hint: 'A popular programming language' },
  { word: 'COMPONENT', hint: 'A reusable piece of UI' },
  { word: 'FUNCTION', hint: 'A block of reusable code' },
  { word: 'ARRAY', hint: 'An ordered collection of items' },
  { word: 'OBJECT', hint: 'A collection of key-value pairs' },
];

export const connectionGroups = [
  {
    category: 'THINGS THAT HAVE SPOTS',
    words: ['DALMATIAN', 'LEOPARD', 'LADYBUG', 'DICE'],
    color: '#FDB347'
  },
  {
    category: 'THINGS YOU CATCH',
    words: ['BALL', 'COLD', 'FISH', 'BREATH'],
    color: '#B7A5DE'
  },
  {
    category: 'BOXING TERMS',
    words: ['RING', 'PUNCH', 'ROUND', 'CORNER'],
    color: '#85C0F9'
  },
  {
    category: 'THINGS WITH SHELLS',
    words: ['TURTLE', 'TACO', 'NUT', 'BULLET'],
    color: '#F9A58B'
  },
  {
    category: '___ CARD',
    words: ['CREDIT', 'WILD', 'GREEN', 'BIRTHDAY'],
    color: '#A0C35A'
  },
  {
    category: 'BREAKFAST FOODS',
    words: ['PANCAKE', 'CEREAL', 'WAFFLE', 'BACON'],
    color: '#B7A5DE'
  },
  {
    category: 'TYPES OF DANCES',
    words: ['WALTZ', 'SALSA', 'TANGO', 'BALLET'],
    color: '#85C0F9'
  },
  {
    category: 'CELESTIAL OBJECTS',
    words: ['MOON', 'COMET', 'PLANET', 'STAR'],
    color: '#F9A58B'
  },
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

// Game Difficulties
export const difficulties = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Game Status
export const gameStatus = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};
