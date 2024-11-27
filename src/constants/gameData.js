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
  
  // Word Scramble Data
  export const wordsList = [
    { word: 'REACT', hint: 'A JavaScript library for building user interfaces' },
    { word: 'JAVASCRIPT', hint: 'A popular programming language' },
    { word: 'COMPONENT', hint: 'A reusable piece of UI' },
    { word: 'FUNCTION', hint: 'A block of reusable code' },
    { word: 'ARRAY', hint: 'An ordered collection of items' },
    { word: 'OBJECT', hint: 'A collection of key-value pairs' },
  ];
  
  // Connections Game Data
  export const connectionGroups = [
    {
      category: 'Colors',
      words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
      difficulty: 'easy',
    },
    {
      category: 'Animals',
      words: ['LION', 'TIGER', 'BEAR', 'WOLF'],
      difficulty: 'medium',
    },
    {
      category: 'Countries',
      words: ['FRANCE', 'SPAIN', 'ITALY', 'GERMANY'],
      difficulty: 'medium',
    },
    {
      category: 'Fruits',
      words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
      difficulty: 'easy',
    },
  ];
  
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
  