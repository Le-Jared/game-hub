import React, { useState, useEffect, useCallback } from 'react';
import { styles } from './Anagrams.styles';

const AnagramGame = () => {
  const [baseWord, setBaseWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [validWords, setValidWords] = useState(new Set());
  const [foundWords, setFoundWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'

  const fetchBaseWord = async () => {
    try {
      // Fetch a random word between 6-8 letters
      const response = await fetch('https://api.datamuse.com/words?sp=???????&max=100');
      const words = await response.json();
      const filteredWords = words
        .filter(word => 
          word.word.length >= 6 && 
          word.word.length <= 8 && 
          /^[a-zA-Z]+$/.test(word.word)
        )
        .map(word => word.word.toLowerCase());
      
      if (filteredWords.length === 0) throw new Error('No suitable words found');
      
      const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
      return randomWord;
    } catch (error) {
      console.error('Error fetching base word:', error);
      // Fallback words if API fails
      const fallbackWords = ['elephant', 'rainbow', 'station', 'picture'];
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }
  };

  const findValidAnagrams = async (word) => {
    try {
      // Get all possible words that can be made from the letters
      const letters = word.split('').sort().join('');
      const response = await fetch(`https://api.datamuse.com/words?sp=[${word}]&max=1000`);
      const words = await response.json();
      
      const validAnagrams = new Set();
      
      for (const result of words) {
        const candidate = result.word.toLowerCase();
        if (
          candidate !== word &&
          candidate.length >= 3 &&
          isValidWord(candidate, word)
        ) {
          // Verify word exists in dictionary
          const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${candidate}`);
          if (dictResponse.ok) {
            validAnagrams.add(candidate);
          }
        }
      }
      
      return validAnagrams;
    } catch (error) {
      console.error('Error finding anagrams:', error);
      return new Set();
    }
  };

  const isValidWord = (candidate, baseWord) => {
    const baseLetters = {};
    for (const letter of baseWord) {
      baseLetters[letter] = (baseLetters[letter] || 0) + 1;
    }
    
    for (const letter of candidate) {
      if (!baseLetters[letter]) return false;
      baseLetters[letter]--;
    }
    
    return true;
  };

  const startGame = async () => {
    setIsLoading(true);
    try {
      const word = await fetchBaseWord();
      const anagrams = await findValidAnagrams(word);
      
      setBaseWord(word);
      setValidWords(anagrams);
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
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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
        <div>
          <h2>Find as many words as you can!</h2>
          <button style={styles.button} onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

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
