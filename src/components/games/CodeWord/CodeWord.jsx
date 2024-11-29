import { useState, useEffect } from 'react';
import styles from './CodeWord.module.css';

const CodeWord = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [gameState, setGameState] = useState({
    targetWord: '',
    currentGuess: '',
    guesses: [],
    feedback: [],
    attempts: 6,
    gameOver: false,
    message: '',
    keyboardStatus: {},
    loading: true,
    error: null
  });

  const resetGame = () => {
    setGameState({
      targetWord: '',
      currentGuess: '',
      guesses: [],
      feedback: [],
      attempts: 6,
      gameOver: false,
      message: '',
      keyboardStatus: initializeKeyboard(),
      loading: true,
      error: null
    });
    setShowHint(false);
    fetchWord();
  };

  const getHint = async (word) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?sp=${word.toLowerCase()}&md=d`);
      const data = await response.json();
      const wordData = data.find(item => item.word.toUpperCase() === word);
      return wordData?.defs?.[0] || 'A computing or technology-related term';
    } catch (error) {
      console.error('Error fetching hint:', error);
      return 'A computing or technology-related term';
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    try {
      const response = await fetch('https://api.datamuse.com/words?' + new URLSearchParams({
        sp: '?????',
        topics: 'technology,computing',
        max: '100'
      }));
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const validWords = data
        .filter(word => word.word.length === 5)
        .map(word => word.word.toUpperCase());
      
      if (validWords.length === 0) throw new Error('No valid words found');
      const randomWord = validWords[Math.floor(Math.random() * validWords.length)];
      
      // Get hint for the word
      const wordHint = await getHint(randomWord);
      setHint(wordHint);

      setGameState(prev => ({
        ...prev,
        targetWord: randomWord,
        keyboardStatus: initializeKeyboard(),
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching word:', error);
      useFallbackWord();
    }
  };

  const useFallbackWord = () => {
    const techWords = ['REACT', 'REDUX', 'PROXY', 'CLASS', 'ARRAY', 'FETCH', 'ASYNC', 'STACK', 'QUEUE', 'CACHE', 'DEBUG', 'LINUX', 'MYSQL', 'MONGO', 'CLOUD'];
    const randomWord = techWords[Math.floor(Math.random() * techWords.length)];
    const fallbackHints = {
      'REACT': 'A JavaScript library for building user interfaces',
      'REDUX': 'A state management tool for JavaScript applications',
      'PROXY': 'An intermediary server that forwards requests',
      'CLASS': 'A blueprint for creating objects in programming',
      'ARRAY': 'A data structure that stores elements in ordered list',
      'FETCH': 'A method to make network requests in JavaScript',
      'ASYNC': 'Code execution that doesn\'t block other operations',
      'STACK': 'A last-in-first-out (LIFO) data structure',
      'QUEUE': 'A first-in-first-out (FIFO) data structure',
      'CACHE': 'Temporary storage for quick data access',
      'DEBUG': 'Process of finding and fixing code errors',
      'LINUX': 'An open-source operating system kernel',
      'MYSQL': 'A popular relational database system',
      'MONGO': 'A NoSQL database program',
      'CLOUD': 'Remote servers accessed via the internet'
    };
    
    setHint(fallbackHints[randomWord] || 'A computing or technology-related term');
    setGameState(prev => ({
      ...prev,
      targetWord: randomWord,
      keyboardStatus: initializeKeyboard(),
      loading: false
    }));
  };

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

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('←');
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [gameState]);

  const submitGuess = () => {
    if (gameState.currentGuess.length !== 5) {
      setGameState(prev => ({
        ...prev,
        message: 'Word must be 5 letters!'
      }));
      return;
    }

    const feedback = [];
    const targetLetters = gameState.targetWord.split('');
    const guessLetters = gameState.currentGuess.split('');
    const newKeyboardStatus = { ...gameState.keyboardStatus };

    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        feedback[i] = 'correct';
        targetLetters[i] = null;
        newKeyboardStatus[letter] = 'correct';
      }
    });

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
          if (newKeyboardStatus[letter] !== 'correct' && newKeyboardStatus[letter] !== 'present') {
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
      keyboardStatus: newKeyboardStatus,
      message: ''  // Clear any previous messages
    };

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

  if (gameState.loading) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  return (
    <div className={styles.codewordContainer}>
      <h1>CodeWord</h1>
      
      {showInstructions && (
        <div className={styles.instructions}>
          <h2>How to Play</h2>
          <ul>
            <li>Guess the 5-letter word in 6 tries.</li>
            <li>Each guess must be a valid 5-letter word.</li>
            <li>After each guess, the color of the tiles will change:</li>
            <div className={styles.examples}>
              <div className={`${styles.guessCell} ${styles.correct}`}>A</div>
              <span>Letter is correct and in right position</span>
              <div className={`${styles.guessCell} ${styles.present}`}>B</div>
              <span>Letter is in the word but wrong position</span>
              <div className={`${styles.guessCell} ${styles.absent}`}>C</div>
              <span>Letter is not in the word</span>
            </div>
          </ul>
          <button 
            className={styles.startButton}
            onClick={() => setShowInstructions(false)}
          >
            Start Playing
          </button>
        </div>
      )}

      {!showInstructions && (
        <>
          <div className={styles.gameControls}>
            <button 
              className={styles.resetButton}
              onClick={resetGame}
            >
              New Game
            </button>
            <button 
              className={styles.hintButton}
              onClick={() => setShowHint(true)}
              disabled={showHint}
            >
              Show Hint
            </button>
          </div>

          {showHint && (
            <div className={styles.hint}>
              Hint: {hint}
            </div>
          )}

          {gameState.message && (
            <div className={styles.message}>{gameState.message}</div>
          )}
          
          <div className={styles.gameBoard}>
            {/* Render previous guesses */}
            {gameState.guesses.map((guess, i) => (
              <div key={`guess-${i}`} className={styles.guessRow}>
                {guess.split('').map((letter, j) => (
                  <div 
                    key={`guess-${i}-${j}`} 
                    className={`${styles.guessCell} ${styles[gameState.feedback[i][j]]}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}

            {/* Render current guess */}
            {!gameState.gameOver && (
              <div className={styles.guessRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`current-${i}`} className={styles.guessCell}>
                    {gameState.currentGuess[i] || ''}
                  </div>
                ))}
              </div>
            )}

            {/* Render remaining empty rows */}
            {Array.from({ length: Math.max(0, gameState.attempts - 1) }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.guessRow}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={`empty-${i}-${j}`} className={styles.guessCell}>
                    {''}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.keyboard}>
            {keyboard.map((row, i) => (
              <div key={`row-${i}`} className={styles.keyboardRow}>
                {row.map((key) => (
                  <button
                    key={key}
                    className={`${styles.key} ${styles[gameState.keyboardStatus[key] || 'unused']}`}
                    onClick={() => handleKeyPress(key)}
                    disabled={gameState.gameOver}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CodeWord;