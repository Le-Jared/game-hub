import React, { useState, useEffect, useCallback } from 'react';
import { styles } from './Anagrams.styles';

const AnagramGame = () => {
  const [baseWord, setBaseWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [validWords, setValidWords] = useState(new Set());
  const [foundWords, setFoundWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState('start');
  const [wordsList, setWordsList] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const timerRef = useRef(null);

  const Instructions = () => (
    <div style={styles.instructionsModal}>
      <div style={styles.instructionsContent}>
        <h2>How to Play</h2>
        <ol style={styles.instructionsList}>
          <li>You'll be given a 6-letter word as your base word</li>
          <li>Find as many words as you can using those letters</li>
          <li>Rules:
            <ul>
              <li>Words must be at least 3 letters long</li>
              <li>You can use each letter only once per word</li>
              <li>Score is based on word length (10 points per letter)</li>
            </ul>
          </li>
          <li>You have 3 minutes to find as many words as possible</li>
        </ol>
        <button 
          style={styles.button}
          onClick={() => setShowInstructions(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  );

  const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'YOUR_API_KEY';
  
  const findAnagrams = async (word) => {
    if (!/^[a-zA-Z]+$/.test(word)) {
      return [];
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };

    try {
      const checkWordResponse = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(word)}`, options);
      if (!checkWordResponse.ok) {
        return []; 
      }

      const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(word)}/anagrams`, options);
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.anagrams || [];
    } catch (error) {
      console.error('Error fetching anagrams:', error);
      return [];
    }
  };

  const generateWordsList = async () => {
    const cached = localStorage.getItem('anagramWords');
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (parsedCache.timestamp > Date.now() - 3600000) {
        return parsedCache.data;
      }
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };

    const fallbackWords = [
      { base: 'garden', anagrams: ['danger', 'ranged', 'gander'] },
      { base: 'silent', anagrams: ['listen', 'inlets', 'tinsel'] },
      { base: 'master', anagrams: ['stream', 'tamers'] },
      { base: 'plates', anagrams: ['staple', 'pleats', 'petals'] },
      { base: 'points', anagrams: ['piston', 'pintos'] },
      { base: 'spider', anagrams: ['pride', 'spired', 'sprite'] },
      { base: 'united', anagrams: ['untied', 'dentin'] },
      { base: 'rescue', anagrams: ['secure', 'recuse'] },
      { base: 'scared', anagrams: ['sacred', 'cedars'] },
      { base: 'stream', anagrams: ['master', 'tamers'] },
      { base: 'notice', anagrams: ['action', 'cation'] },
      { base: 'player', anagrams: ['parley', 'replay'] },
      { base: 'remain', anagrams: ['marine', 'airmen'] },
      { base: 'handle', anagrams: ['healed', 'healed'] },
      { base: 'caring', anagrams: ['racing', 'gracia'] }
    ];    

    try {
      let word;
      let anagrams;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        const response = await fetch('https://wordsapiv1.p.rapidapi.com/words/?random=true&letters=6', options);
        if (!response.ok) {
          throw new Error('Failed to fetch random word');
        }
        
        const data = await response.json();
        word = data.word;

        if (/^[a-zA-Z]+$/.test(word)) {
          anagrams = await findAnagrams(word);
          if (anagrams.length >= 2) { 
            break;
          }
        }
        attempts++;
      }

      if (attempts >= maxAttempts || !anagrams || anagrams.length < 2) {
        return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      }

      const wordData = {
        base: word,
        anagrams: anagrams.filter(w => w !== word && w.length >= 3)
      };

      localStorage.setItem('anagramWords', JSON.stringify({
        timestamp: Date.now(),
        data: wordData
      }));

      return wordData;
    } catch (error) {
      console.error('Error generating words:', error);
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }
  };


  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      try {
        const wordData = await generateWordsList();
        setWordsList([wordData]);
      } catch (error) {
        console.error('Error loading words:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    try {
      const wordData = await generateWordsList();
      setBaseWord(wordData.base);
      setValidWords(new Set(wordData.anagrams));
      setFoundWords(new Set());
      setScore(0);
      setTimeLeft(180);
      setGameState('playing');
      startTimer();
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);  

  const handleSubmit = (e) => {
    e.preventDefault();
    const word = userInput.toLowerCase().trim();
    
    if (word.length < 3) {
      setMessage('Word must be at least 3 letters long');
      return;
    }

    if (foundWords.has(word)) {
      setMessage('Word already found!');
      return;
    }

    if (validWords.has(word)) {
      setFoundWords(prev => new Set([...prev, word]));
      setScore(prev => prev + (word.length * 10));
      setMessage('Good job! +' + (word.length * 10) + ' points');
      setUserInput('');
    } else {
      setMessage('Not a valid word');
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      return startTimer();
    }
  }, [gameState, startTimer]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading game...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Anagram Game</h1>
      
      {gameState === 'start' && (
        <div style={styles.startScreen}>
          <h2>Welcome to Anagram Game!</h2>
          <button 
            style={styles.button} 
            onClick={() => setShowInstructions(true)}
          >
            How to Play
          </button>
          <button 
            style={{...styles.button, marginLeft: '10px'}} 
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {showInstructions && <Instructions />}

      {gameState === 'playing' && (
        <>
          <div style={styles.stats}>
            <div>Score: {score}</div>
            <div>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            <div>Found: {foundWords.size}/{validWords.size}</div>
          </div>

          <div style={styles.baseWord}>{baseWord.toUpperCase()}</div>

          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter word"
              autoFocus
            />
            <button style={styles.button} type="submit">
              Submit
            </button>
          </form>

          {message && (
            <div style={{
              ...styles.message,
              backgroundColor: message.includes('+') ? '#d4edda' : '#f8d7da',
              color: message.includes('+') ? '#155724' : '#721c24',
            }}>
              {message}
            </div>
          )}

          <div style={styles.foundWordsContainer}>
            {[...foundWords].sort().map(word => (
              <span key={word} style={styles.foundWord}>
                {word}
              </span>
            ))}
          </div>
        </>
      )}

      {gameState === 'gameOver' && (
        <div>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <p>Words Found: {foundWords.size}</p>
          <div style={styles.foundWordsContainer}>
            {[...foundWords].sort().map(word => (
              <span key={word} style={styles.foundWord}>
                {word}
              </span>
            ))}
          </div>
          <button style={styles.button} onClick={startGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AnagramGame;
