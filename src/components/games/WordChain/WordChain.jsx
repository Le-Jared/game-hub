import { useState, useEffect } from 'react';
import { styles } from './WordChain.styles';

const WordChain = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [wordChain, setWordChain] = useState([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setWordChain([]);
    setScore(0);
    setTimeLeft(60);
    setMessage('Game started! Enter your first word.');
  };

  const endGame = () => {
    setIsPlaying(false);
    setMessage(`Game Over! Final Score: ${score}`);
  };

  const checkWordValidity = async (word) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      const data = await response.json();
      return response.ok && Array.isArray(data);
    } catch (error) {
      console.error('Error checking word:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPlaying) {
      setMessage('Click Start Game to play!');
      return;
    }

    const word = currentWord.trim().toLowerCase();

    if (word.length < 3) {
      setMessage('Word must be at least 3 letters long');
      return;
    }

    if (wordChain.includes(word)) {
      setMessage('Word already used!');
      return;
    }

    // Check if word starts with last letter of previous word
    if (wordChain.length > 0) {
      const lastWord = wordChain[wordChain.length - 1];
      const lastLetter = lastWord[lastWord.length - 1];
      if (word[0] !== lastLetter) {
        setMessage(`Word must start with the letter "${lastLetter}"`);
        return;
      }
    }

    const isValid = await checkWordValidity(word);
    if (!isValid) {
      setMessage('Not a valid word');
      return;
    }

    setWordChain([...wordChain, word]);
    setScore((prev) => prev + word.length);
    setCurrentWord('');
    setMessage('Valid word!');
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.instructionsButton}
        onClick={() => setShowInstructions(!showInstructions)}
      >
        {showInstructions ? 'Hide Instructions' : 'How to Play'}
      </button>

      {showInstructions && (
        <div style={styles.instructions}>
          <h3>How to Play Word Chain</h3>
          <ul>
            <li>Start by entering any valid word</li>
            <li>For each subsequent word, it must:
              <ul>
                <li>Start with the last letter of the previous word</li>
                <li>Be at least 3 letters long</li>
                <li>Be a valid English word</li>
                <li>Not have been used before in the current game</li>
              </ul>
            </li>
            <li>Score points equal to the length of each valid word</li>
            <li>Complete as many words as you can within 60 seconds</li>
          </ul>
        </div>
      )}

      <div style={styles.header}>
        <h1>Word Chain Game</h1>
      </div>

      <div style={styles.gameInfo}>
        <div>Score: {score}</div>
        <div>Time Left: {timeLeft}s</div>
      </div>

      <div>
        <input
          type="text"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          disabled={!isPlaying || isLoading}
          placeholder="Enter a word"
          style={styles.input}
        />
        <button
          onClick={handleSubmit}
          disabled={!isPlaying || isLoading}
          style={styles.button}
        >
          {isLoading ? 'Checking...' : 'Submit'}
        </button>
        <button
          onClick={startGame}
          disabled={isPlaying}
          style={styles.button}
        >
          Start Game
        </button>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.wordList}>
        {wordChain.map((word, index) => (
          <span key={index} style={styles.word}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordChain;