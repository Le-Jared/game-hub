import React, { useState, useEffect } from 'react';
import { wordsList as initialWordsList } from '../../../constants/gameData';
import { styles } from './WordScramble.styles';

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [availableWords, setAvailableWords] = useState([...initialWordsList]);

  const fetchNewWords = async () => {
    try {
      const response = await fetch('/api/words', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }

      const newWords = await response.json();
      setAvailableWords(prevWords => [...prevWords, ...newWords]);
    } catch (error) {
      console.error('Error fetching new words:', error);
    }
  };

  const scrambleWord = (word) => {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray.join('');
  };

  const getNewWord = () => {
    if (availableWords.length <= 3) {
      fetchNewWords();
    }

    if (availableWords.length === 0) {
      setMessage('Loading new words...');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const wordObj = availableWords[randomIndex];
    const updatedWords = availableWords.filter((_, index) => index !== randomIndex);
    
    setAvailableWords(updatedWords);
    setCurrentWord(wordObj.word);
    setHint(wordObj.hint);
    setScrambledWord(scrambleWord(wordObj.word));
    setUserGuess('');
    setMessage('');
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

  return (
    <div style={styles.container}>
      <h2>Word Scramble</h2>
      <div style={styles.score}>Score: {score}</div>
      <div style={styles.scrambledWord}>{scrambledWord}</div>
      <div style={styles.hint}>Hint: {hint}</div>
      
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
      >
        New Word
      </button>
    </div>
  );
};

export default WordScramble;
