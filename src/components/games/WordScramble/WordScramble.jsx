import React, { useState, useEffect } from 'react';
import { styles } from './WordScramble.styles';

const WordScramble = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState([]);
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [wordCache, setWordCache] = useState([]);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('wordScrambleHighScore') || '0')
  );

  const generateCrypticHint = async (word, definition) => {
    const hints = [];

    const vowels = (word.match(/[AEIOU]/g) || []).length;
    const consonants = word.length - vowels;
    hints.push(`Contains ${vowels} vowel${vowels !== 1 ? 's' : ''} and ${consonants} consonant${consonants !== 1 ? 's' : ''}`);

    const letterPattern = word.split('')
      .map(char => 'AEIOU'.includes(char) ? 'V' : 'C')
      .join('');
    hints.push(`Pattern: ${letterPattern}`);

    if (word.length > 4) {
      const firstLetter = word[0];
      const lastLetter = word[word.length - 1];
      if (firstLetter === lastLetter) {
        hints.push("Begins and ends with the same letter");
      } else {
        const startRange = String.fromCharCode(Math.max(65, firstLetter.charCodeAt(0) - 3));
        const endRange = String.fromCharCode(Math.min(90, lastLetter.charCodeAt(0) + 3));
        hints.push(`First letter between ${startRange} and ${endRange}`);
      }
    }

    if (definition && definition !== 'No definition available') {
      const words = definition.split(' ')
        .filter(w => w.length > 3)
        .filter(w => !w.toLowerCase().includes(word.toLowerCase()));
      
      if (words.length >= 2) {
        const crypticDef = words
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .join('...');
        hints.push(`Related to: ${crypticDef}`);
      }
    }

    const uniqueLetters = new Set(word.split('')).size;
    hints.push(`Contains ${uniqueLetters} unique letter${uniqueLetters !== 1 ? 's' : ''}`);

    return hints.sort(() => 0.5 - Math.random()).slice(0, 2);
  };

  const fetchWordDefinition = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error('No definition found');
      const data = await response.json();
      return {
        definition: data[0].meanings[0].definitions[0].definition,
        partOfSpeech: data[0].meanings[0].partOfSpeech
      };
    } catch (error) {
      console.error('Error fetching definition:', error);
      return {
        definition: 'No definition available',
        partOfSpeech: ''
      };
    }
  };

  const fetchWords = async () => {
    try {
      const topics = ['food', 'animal', 'color', 'house', 'nature', 'body', 'weather', 'clothing'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const response = await fetch(`https://api.datamuse.com/words?ml=${randomTopic}&max=50`);
      if (!response.ok) throw new Error('Failed to fetch words');
      
      const words = await response.json();
      return words
        .filter(word => 
          word.word.length >= 4 && 
          word.word.length <= 7 && 
          /^[a-zA-Z]+$/.test(word.word)
        )
        .map(word => word.word.toUpperCase());
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

      const { definition } = await fetchWordDefinition(word);
      const crypticHints = await generateCrypticHint(word, definition);
      
      setCurrentWord(word);
      setScrambledWord(scrambleWord(word));
      setHint(crypticHints);
      setUserGuess('');
      setMessage('');
    } catch (error) {
      console.error('Error getting new word:', error);
      setMessage('Error loading word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userGuess.toUpperCase() === currentWord) {
      const newScore = score + (currentWord.length * 10) + (streak * 5);
      setScore(newScore);
      setStreak(streak + 1);
      setMessage(`Correct! +${(currentWord.length * 10) + (streak * 5)} points (${streak + 1} streak)`);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('wordScrambleHighScore', newScore.toString());
      }
      
      setTimeout(getNewWord, 1500);
    } else {
      setStreak(0);
      setMessage('Try again!');
    }
  };

  useEffect(() => {
    getNewWord();
  }, []);

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
      <div style={styles.score}>
        Score: {score} | High Score: {highScore} | Streak: {streak}
      </div>
      <div style={styles.scrambledWord}>{scrambledWord}</div>
      <div style={styles.hints}>
        {hint.map((h, index) => (
          <div key={index} style={styles.hintItem}>
            {h}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess"
          style={styles.input}
          autoFocus
        />
        <button type="submit" style={styles.button}>
          Check
        </button>
      </form>

      <div 
        style={{
          ...styles.message,
          ...(message.includes('Correct!') ? styles.success : styles.error)
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

