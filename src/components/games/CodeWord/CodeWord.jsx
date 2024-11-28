import { useState, useEffect } from 'react';
import { styles } from './CodeWord.styles';

const CodeWord = () => {
  const [gameState, setGameState] = useState({
    targetWord: '',
    currentGuess: '',
    guesses: [],
    feedback: [],
    attempts: 6,
    gameOver: false,
    message: '',
    keyboardStatus: {}
  });

  // Tech words list - you can expand this or fetch from an API
  const techWords = [
    'REACT', 'REDUX', 'PROXY', 'CLASS', 'ARRAY', 
    'FETCH', 'ASYNC', 'STACK', 'QUEUE', 'CACHE',
    'DEBUG', 'LINUX', 'MYSQL', 'MONGO', 'CLOUD'
  ];

  // Initialize game
  useEffect(() => {
    const randomWord = techWords[Math.floor(Math.random() * techWords.length)];
    setGameState(prev => ({
      ...prev,
      targetWord: randomWord,
      keyboardStatus: initializeKeyboard()
    }));
  }, []);

  const initializeKeyboard = () => {
    const keys = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(key => {
      keys[key] = 'unused';
    });
    return keys;
  };

  const handleKeyPress = (key) => {
    if (gameState.gameOver) return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === '←') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));
    } else if (gameState.currentGuess.length < 5) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key
      }));
    }
  };

  const submitGuess = () => {
    if (gameState.currentGuess.length !== 5) {
      setGameState(prev => ({
        ...prev,
        message: 'Word must be 5 letters!'
      }));
      return;
    }

    // Create feedback array
    const feedback = [];
    const targetLetters = gameState.targetWord.split('');
    const guessLetters = gameState.currentGuess.split('');
    const newKeyboardStatus = { ...gameState.keyboardStatus };

    // First pass: Check for correct positions (green)
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        feedback[i] = 'correct';
        targetLetters[i] = null;
        newKeyboardStatus[letter] = 'correct';
      }
    });

    // Second pass: Check for wrong positions (yellow)
    guessLetters.forEach((letter, i) => {
      if (!feedback[i]) {
        const targetIndex = targetLetters.indexOf(letter);
        if (targetIndex !== -1) {
          feedback[i] = 'present';
          targetLetters[targetIndex] = null;
          if (newKeyboardStatus[letter] !== 'correct') {
            newKeyboardStatus[letter] = 'present';
          }
        } else {
          feedback[i] = 'absent';
          if (newKeyboardStatus[letter] !== 'correct' && 
              newKeyboardStatus[letter] !== 'present') {
            newKeyboardStatus[letter] = 'absent';
          }
        }
      }
    });

    const newState = {
      ...gameState,
      guesses: [...gameState.guesses, gameState.currentGuess],
      feedback: [...gameState.feedback, feedback],
      currentGuess: '',
      attempts: gameState.attempts - 1,
      keyboardStatus: newKeyboardStatus
    };

    // Check win/lose conditions
    if (gameState.currentGuess === gameState.targetWord) {
      newState.gameOver = true;
      newState.message = 'Congratulations! You won! 🎉';
    } else if (newState.attempts === 0) {
      newState.gameOver = true;
      newState.message = `Game Over! The word was ${gameState.targetWord}`;
    }

    setGameState(newState);
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
  ];

  return (
    <div className="codeword-container">
      <h1>CodeWord</h1>
      <div className="game-board">
        {/* Previous Guesses */}
        {gameState.guesses.map((guess, i) => (
          <div key={i} className="guess-row">
            {guess.split('').map((letter, j) => (
              <div 
                key={j} 
                className={`guess-cell ${gameState.feedback[i][j]}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}

        {/* Current Guess */}
        {!gameState.gameOver && (
          <div className="guess-row">
            {Array(5).fill('').map((_, i) => (
              <div key={i} className="guess-cell">
                {gameState.currentGuess[i] || ''}
              </div>
            ))}
          </div>
        )}

        {/* Empty Rows */}
        {Array(gameState.attempts - 1).fill('').map((_, i) => (
          <div key={i} className="guess-row">
            {Array(5).fill('').map((_, j) => (
              <div key={j} className="guess-cell"></div>
            ))}
          </div>
        ))}
      </div>

      {/* Message Display */}
      {gameState.message && (
        <div className="message">{gameState.message}</div>
      )}

      {/* Keyboard */}
      <div className="keyboard">
        {keyboard.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={`key ${gameState.keyboardStatus[key] || ''}`}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeWord;