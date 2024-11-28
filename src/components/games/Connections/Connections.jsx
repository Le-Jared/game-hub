import { GoogleGenerativeAI } from '@google/generative-ai';
import { styles } from './Connections.styles';
import { 
  connectionGroups as initialConnectionGroups,
  GAME_MODES,
  INSTRUCTIONS 
} from '../../../constants/gameData';
import React, { useState, useEffect, useRef } from 'react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const generateConnectionGroups = async () => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `Generate exactly 16 connection groups as a JSON array. Format:
[
  {
    "category": "CATEGORY NAME",
    "words": ["WORD1", "WORD2", "WORD3", "WORD4"],
    "color": "#COLOR"
  }
]
Rules:
1. Use ONLY these colors: #FDB347, #B7A5DE, #85C0F9, #F9A58B
2. ALL text must be in UPPERCASE
3. Each group MUST have exactly 4 words
4. No duplicate words or categories
5. Return ONLY valid JSON, no explanations or additional text`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.includes('[')) {
      text = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Received text:', text);
      throw new Error('Invalid JSON response');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }
    const validColors = ['#FDB347', '#B7A5DE', '#85C0F9', '#F9A58B'];

    const validGroups = parsed.filter(group => {
      try {
        return (
          group.category &&
          typeof group.category === 'string' &&
          Array.isArray(group.words) &&
          group.words.length === 4 &&
          group.words.every(word => typeof word === 'string') &&
          validColors.includes(group.color)
        );
      } catch (e) {
        return false;
      }
    });

    if (validGroups.length < 4) {
      throw new Error('Not enough valid groups generated');
    }
    return validGroups;
  } catch (error) {
    console.error('Generation Error:', error);
    throw error;
  }
};

const Connections = () => {
  const [gameState, setGameState] = useState('mode');
  const [gameMode, setGameMode] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [message, setMessage] = useState('');
  const [displayedWords, setDisplayedWords] = useState([]);
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [availableGroups, setAvailableGroups] = useState(initialConnectionGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [backupGroups, setBackupGroups] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const messageTimeout = React.useRef();
  const timerRef = React.useRef();

  const fetchNewGroups = async () => {
    try {
      const newGroups = await generateConnectionGroups();
      return newGroups;
    } catch (error) {
      console.error('Failed to generate connections:', error);
      return null;
    }
  };

  useEffect(() => {
    const preloadNextGroups = async () => {
      if (displayedWords.length <= 16 && !backupGroups && !isPreloading) {
        setIsPreloading(true);
        const newGroups = await fetchNewGroups();
        setBackupGroups(newGroups);
        setIsPreloading(false);
      }
    };

    preloadNextGroups();
  }, [displayedWords.length, backupGroups, isPreloading]);

  useEffect(() => {
    setTimerPaused(isLoading);
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (messageTimeout.current) {
        clearTimeout(messageTimeout.current);
        messageTimeout.current = null;
      }
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (timerPaused) {
          return prev;
        }
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const initializeGame = async (mode) => {
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  
    setIsLoading(true);
    setTimerPaused(true);
    
    try {
      setGameMode(mode);
      let selectedGroups;
  
      if (backupGroups) {
        selectedGroups = backupGroups.slice(0, 4);
        setBackupGroups(null);
      } else {
        selectedGroups = availableGroups.slice(0, 4);
        
        if (selectedGroups.length < 4) {
          const newGroups = await fetchNewGroups();
          selectedGroups = newGroups.slice(0, 4);
        }
      }
  
      const allWords = selectedGroups.flatMap(group => 
        group.words.map(word => ({
          word,
          category: group.category,
          color: group.color
        }))
      );
  
      setAvailableGroups(prevGroups => 
        prevGroups.filter(group => !selectedGroups.includes(group))
      );
  
      setDisplayedWords(shuffle([...allWords]));
      setGameState('playing');
      
      if (mode === GAME_MODES.COMPETITIVE) {
        setTimeout(() => {
          startTimer();
        }, 0);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
      showTemporaryMessage('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
      setTimerPaused(false);
    }
  };
  
  const handleSkip = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimerPaused(true);
    
    if (gameMode === GAME_MODES.CASUAL) {
      await initializeGame(GAME_MODES.CASUAL);
    } else if (gameMode === GAME_MODES.COMPETITIVE) {
      setScore(prev => prev - 50);
      setTimeLeft(prev => Math.max(0, prev - 30));
      showTemporaryMessage('Skipped! -50 points and -30 seconds');
      await new Promise(resolve => setTimeout(resolve, 0));
      await initializeGame(GAME_MODES.COMPETITIVE);
    }
  };

  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  };
  
  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    if (messageTimeout.current) {
      clearTimeout(messageTimeout.current);
    }
    messageTimeout.current = setTimeout(() => {
      setMessage('');
    }, 2000);
  };
  
  const handleWordClick = (wordObj) => {
    if (selectedWords.length === 4) {
      return;
    }
  
    const isSelected = selectedWords.find(w => w.word === wordObj.word);
    
    if (isSelected) {
      setSelectedWords(selectedWords.filter(w => w.word !== wordObj.word));
    } else {
      const newSelected = [...selectedWords, wordObj];
      setSelectedWords(newSelected);
      
      if (newSelected.length === 4) {
        checkGroup(newSelected);
      }
    }
  };

  const checkGroup = async (selected) => {
    const category = selected[0].category;
    const isCorrect = selected.every(word => word.category === category);
  
    if (isCorrect) {
      const points = gameMode === GAME_MODES.COMPETITIVE ? 
        Math.ceil(timeLeft / 8) + 20 : 
        1;
      
      setScore(prev => prev + points);
      showTemporaryMessage(`Correct! +${points} points`);
      setSolvedGroups(prev => [...prev, {
        category,
        words: selected.map(s => s.word),
        color: selected[0].color
      }]);
  
      setDisplayedWords(prev => 
        prev.filter(word => !selected.find(s => s.word === word.word))
      );
  
      if (displayedWords.length <= 4) {
        if (gameMode === GAME_MODES.COMPETITIVE) {
          setTimerPaused(true);
          await initializeGame(GAME_MODES.COMPETITIVE);
        } else {
          setGameState('gameOver');
        }
      }
    } else {
      if (gameMode === GAME_MODES.COMPETITIVE) {
        setScore(prev => prev - 10);
        showTemporaryMessage('Incorrect! -10 points');
      } else {
        showTemporaryMessage('Incorrect! Try again');
      }
    }
    setSelectedWords([]);
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Connections</h2>
        {gameState === 'playing' && (
          <div style={styles.gameInfo}>
            <div style={styles.score}>Score: {score}</div>
            {gameMode === GAME_MODES.COMPETITIVE && (
              <div style={styles.timer}>
                Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                {timerPaused && ' (Paused)'}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && <div style={styles.loading}>Loading...</div>}

      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('Correct') ? '#4CAF50' : '#f44336',
          color: 'white'
        }}>
          {message}
        </div>
      )}

      {gameState === 'mode' && !isLoading && (
        <div style={styles.modeSelect}>
          <h2>Select Game Mode</h2>
          {showInstructions && (
            <div style={styles.instructions}>
              {Object.values(GAME_MODES).map(mode => (
                <div key={mode} style={styles.modeInstructions}>
                  <h3>{INSTRUCTIONS[mode].title}</h3>
                  <ul>
                    {INSTRUCTIONS[mode].rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div style={styles.modeButtons}>
            <button
              style={styles.modeButton}
              onClick={() => initializeGame(GAME_MODES.CASUAL)}
            >
              Casual
            </button>
            <button
              style={styles.modeButton}
              onClick={() => initializeGame(GAME_MODES.COMPETITIVE)}
            >
              Competitive
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && !isLoading && (
        <div style={styles.gameBoard}>
          <div style={styles.wordGrid}>
            {displayedWords.map((wordObj, index) => (
              <button
                key={index}
                style={{
                  ...styles.wordButton,
                  backgroundColor: selectedWords.find(w => w.word === wordObj.word)
                    ? '#a0a0a0'
                    : '#e0e0e0',
                  transform: selectedWords.find(w => w.word === wordObj.word)
                    ? 'scale(0.95)'
                    : 'scale(1)'
                }}
                onClick={() => handleWordClick(wordObj)}
              >
                {wordObj.word}
              </button>
            ))}
          </div>

          <div style={styles.solvedGroups}>
            {solvedGroups.map((group, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.solvedGroup,
                  backgroundColor: group.color
                }}
              >
                {group.category}: {group.words.join(', ')}
              </div>
            ))}
          </div>

          <button 
            style={{
              ...styles.skipButton,
              backgroundColor: gameMode === GAME_MODES.COMPETITIVE ? '#ff4444' : '#4CAF50'
            }}
            onClick={handleSkip}
          >
            {gameMode === GAME_MODES.COMPETITIVE 
              ? 'Skip (-50 points, -30 seconds)' 
              : 'Skip to Next Groups'}
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div style={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <div style={styles.solvedCategories}>
            {solvedGroups.map((group, index) => (
              <div key={index}>
                <h3>{group.category}</h3>
                <p>{group.words.join(', ')}</p>
              </div>
            ))}
          </div>
          <button 
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Connections;