import { useState, useEffect } from 'react';
import styles from './WordDefinition.module.css';

const WordDefinition = () => {
  const [gameState, setGameState] = useState({
    word: '',
    definition: '',
    options: [],
    selectedOption: null,
    score: 0,
    totalQuestions: 0,
    loading: true,
    error: null,
    showResult: false,
    isCorrect: false
  });

  const [showInstructions, setShowInstructions] = useState(true);

  const fetchWord = async () => {
    try {
      setGameState(prev => ({ ...prev, loading: true }));
      const response = await fetch('https://api.datamuse.com/words?' + new URLSearchParams({
        sp: '????',
        md: 'd',
        max: '50'
      }));
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const wordsWithDefs = data.filter(word => word.defs && word.defs.length > 0);
      
      if (wordsWithDefs.length === 0) throw new Error('No valid words found');
      
      const selectedWord = wordsWithDefs[Math.floor(Math.random() * wordsWithDefs.length)];
      const correctDefinition = selectedWord.defs[0].replace(/^[a-z]\s+/, '');
      const wrongDefinitions = wordsWithDefs
        .filter(w => w.word !== selectedWord.word)
        .map(w => w.defs[0].replace(/^[a-z]\s+/, ''))
        .slice(0, 3);
      
      const allOptions = [correctDefinition, ...wrongDefinitions];
      const shuffledOptions = shuffleArray(allOptions);
      
      setGameState(prev => ({
        ...prev,
        word: selectedWord.word.toUpperCase(),
        definition: correctDefinition,
        options: shuffledOptions,
        loading: false,
        selectedOption: null,
        showResult: false
      }));
    } catch (error) {
      useFallbackWord();
    }
  };

  const useFallbackWord = () => {
    const fallbackWords = [
      {
        word: 'ARRAY',
        definition: 'An ordered collection of elements',
        wrongDefs: [
          'A type of loop in programming',
          'A method to sort data',
          'A programming error'
        ]
      },
      {
        word: 'DEBUG',
        definition: 'To identify and remove errors from computer software',
        wrongDefs: [
          'To compress computer files',
          'To encrypt data',
          'To optimize code performance'
        ]
      },
      {
        word: 'CACHE',
        definition: 'A hardware or software component that stores data for faster retrieval',
        wrongDefs: [
          'A type of computer virus',
          'A backup storage system',
          'A network protocol'
        ]
      }
    ];

    const randomWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    const shuffledOptions = shuffleArray([randomWord.definition, ...randomWord.wrongDefs]);

    setGameState(prev => ({
      ...prev,
      word: randomWord.word,
      definition: randomWord.definition,
      options: shuffledOptions,
      loading: false,
      selectedOption: null,
      showResult: false
    }));
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    fetchWord();
  }, []);

  const handleOptionSelect = (option) => {
    const isCorrect = option === gameState.definition;
    setGameState(prev => ({
      ...prev,
      selectedOption: option,
      showResult: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1
    }));
  };

  if (gameState.loading) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>WordDefinition</h1>
      
      {showInstructions ? (
        <div className={styles.instructions}>
          <h2>How to Play</h2>
          <ul>
            <li>You will be shown a word and four possible definitions</li>
            <li>Select the correct definition for the given word</li>
            <li>Score points for each correct answer</li>
            <li>Try to get as many correct definitions as possible!</li>
          </ul>
          <button 
            className={styles.startButton}
            onClick={() => setShowInstructions(false)}
          >
            Start Playing
          </button>
        </div>
      ) : (
        <>
          <div className={styles.scoreBoard}>
            Score: {gameState.score} / {gameState.totalQuestions}
          </div>

          <div className={styles.wordCard}>
            <h2>{gameState.word}</h2>
          </div>

          <div className={styles.optionsContainer}>
            {gameState.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  gameState.showResult
                    ? option === gameState.definition
                      ? styles.correct
                      : gameState.selectedOption === option
                      ? styles.incorrect
                      : ''
                    : gameState.selectedOption === option
                    ? styles.selected
                    : ''
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={gameState.showResult}
              >
                {option}
              </button>
            ))}
          </div>

          {gameState.showResult && (
            <div className={styles.resultContainer}>
              <p className={gameState.isCorrect ? styles.correct : styles.incorrect}>
                {gameState.isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
              <button 
                className={styles.nextButton}
                onClick={fetchWord}
              >
                Next Word
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordDefinition;