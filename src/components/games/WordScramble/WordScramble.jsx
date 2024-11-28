import React, { useState, useEffect } from 'react';
import { styles } from './WordScramble.styles';

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wordCache, setWordCache] = useState([]);

  const fetchWordDefinition = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error('No definition found');
      const data = await response.json();
      return data[0].meanings[0].definitions[0].definition;
    } catch (error) {
      console.error('Error fetching definition:', error);
      return 'No definition available';
    }
  };

  const fetchWords = async () => {
    try {
      // Get words that are related to common topics and between 4-7 letters
      const topics = ['food', 'animal', 'color', 'house', 'nature'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const response = await fetch(`https://api.datamuse.com/words?ml=${randomTopic}&max=50`);
      if (!response.ok) throw new Error('Failed to fetch words');
      
      const words = await response.json();
      const filteredWords = words
        .filter(word => word.word.length >= 4 && word.word.length <= 7 && /^[a-zA-Z]+$/.test(word.word))
        .map(word => word.word.toUpperCase());

      return filteredWords;
    } catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  };

  const scrambleWord = (word) => {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    const scrambled = wordArray.join('');
    return scrambled === word ? scrambleWord(word) : scrambled;
  };

  const getNewWord = async () => {
    setIsLoading(true);
    try {
      let word;
      if (wordCache.length > 0) {
        word = wordCache[0];
        setWordCache(prev => prev.slice(1));
      } else {
        const newWords = await fetchWords();
        if (newWords.length === 0) throw new Error('No words available');
        word = newWords[0];
        setWordCache(newWords.slice(1));
      }

      const definition = await fetchWordDefinition(word);
      
      setCurrentWord(word);
      setScrambledWord(scrambleWord(word));
      setHint(definition);
      setUserGuess('');
      setMessage('');
    } catch (error) {
      console.error('Error getting new word:', error);
      setMessage('Error loading word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNewWord();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userGuess.toUpperCase() === currentWord) {
      setMessage('Correct! Well done!');
      setScore(score + 1);
      setTimeout(getNewWord, 1500);
    } else {
      setMessage('Try again!');
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h2>Word Scramble</h2>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Word Scramble</h2>
      <div style={styles.score}>Score: {score}</div>
      <div style={styles.scrambledWord}>{scrambledWord}</div>
      <div style={styles.hint}>
        <strong>Definition:</strong> {hint}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Check
        </button>
      </form>

      <div 
        style={{
          ...styles.message,
          ...(message === 'Correct! Well done!' ? styles.success : styles.error)
        }}
      >
        {message}
      </div>

      <button 
        onClick={getNewWord} 
        style={{...styles.button, backgroundColor: '#2ecc71'}}
        disabled={isLoading}
      >
        New Word
      </button>
    </div>
  );
};

export default WordScramble;

