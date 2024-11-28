import { useState, useEffect } from 'react';
import { styles } from './SpellingBee.styles';

const SpellingBee = () => {
  const [centerLetter, setCenterLetter] = useState('');
  const [outerLetters, setOuterLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [rank, setRank] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    
    let letters = [];
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    
    while (letters.length < 7) {
      const letter = consonants[Math.floor(Math.random() * consonants.length)];
      if (!letters.includes(letter)) {
        letters.push(letter);
      }
    }
    
    letters = letters.sort(() => Math.random() - 0.5);
    setCenterLetter(letters[0]);
    setOuterLetters(letters.slice(1));
  };

  useEffect(() => {
    if (score >= 40) setRank('Genius');
    else if (score >= 25) setRank('Amazing');
    else if (score >= 15) setRank('Good');
    else setRank('Beginner');
  }, [score]);

  const handleLetterClick = (letter) => {
    setCurrentWord(prev => prev + letter);
  };

  const handleDelete = () => {
    setCurrentWord(prev => prev.slice(0, -1));
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
    if (currentWord.length < 4) {
      showMessage('Word must be at least 4 letters long');
      return;
    }

    if (!currentWord.includes(centerLetter)) {
      showMessage('Word must include center letter');
      return;
    }

    if (foundWords.has(currentWord)) {
      showMessage('Word already found');
      return;
    }

    const validLetters = [centerLetter, ...outerLetters];
    const hasInvalidLetters = [...currentWord].some(
      letter => !validLetters.includes(letter)
    );
    if (hasInvalidLetters) {
      showMessage('Invalid letters used');
      return;
    }

    const isValid = await checkWordValidity(currentWord);
    if (!isValid) {
      showMessage('Not a valid word');
      return;
    }

    let points = calculatePoints(currentWord);
    setScore(prev => prev + points);
    setFoundWords(prev => new Set([...prev, currentWord]));
    showMessage(`+${points} points!`);
    setCurrentWord('');
  };

  const calculatePoints = (word) => {
    const isAllLetters = new Set([...word]).size === 7;
    const basePoints = word.length === 4 ? 1 :
                      word.length === 5 ? 2 :
                      word.length === 6 ? 3 :
                      4;
    return isAllLetters ? basePoints + 7 : basePoints;
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
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
          <div style={styles.instructionsText}>
            <h3>How to Play Spelling Bee</h3>
            <ul style={styles.instructionsList}>
              <li>Create words using letters from the honeycomb</li>
              <li>Words must be at least 4 letters long</li>
              <li>Words must include the center letter (yellow)</li>
              <li>Letters can be reused</li>
              <li>Scoring:
                <ul>
                  <li>4 letters = 1 point</li>
                  <li>5 letters = 2 points</li>
                  <li>6 letters = 3 points</li>
                  <li>7+ letters = 4 points</li>
                  <li>Using all 7 letters = +7 bonus points</li>
                </ul>
              </li>
            </ul>
            <p>Achieve different ranks as you score more points:
              <br/>Beginner (0-14) → Good (15-24) → Amazing (25-39) → Genius (40+)</p>
          </div>
        </div>
      )}
  
      <div style={styles.gameHeader}>
        <h2 style={styles.title}>Spelling Bee</h2>
        <div style={styles.scoreBoard}>
          <p style={styles.scoreText}>Score: {score}</p>
          <p style={styles.scoreText}>Rank: {rank}</p>
        </div>
        {message && <div style={styles.message}>{message}</div>}
      </div>
  
      <div style={styles.currentWord}>{currentWord}</div>
  
      <div style={styles.honeycomb}>
        {outerLetters.map((letter, index) => (
          <button
            key={index}
            style={{
              ...styles.letter,
              ...styles.outerLetter,
              ...styles.outerLetterPositions[index]
            }}
            onClick={() => handleLetterClick(letter)}
            disabled={isLoading}
          >
            {letter}
          </button>
        ))}
        <button
          style={{...styles.letter, ...styles.centerLetter}}
          onClick={() => handleLetterClick(centerLetter)}
          disabled={isLoading}
        >
          {centerLetter}
        </button>
      </div>
  
      <div style={styles.controls}>
        <button 
          style={{...styles.button, ...styles.deleteButton}}
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </button>
        <button 
          style={styles.button}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Checking...' : 'Enter'}
        </button>
      </div>
  
      <div style={styles.foundWordsContainer}>
        <h3 style={styles.foundWordsTitle}>
          Found Words ({foundWords.size})
        </h3>
        <div style={styles.wordsList}>
          {[...foundWords].sort().map((word, index) => (
            <span key={index} style={styles.foundWord}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );  
};

export default SpellingBee;
