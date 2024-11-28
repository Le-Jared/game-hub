import React, { useState, useEffect } from 'react';
import { styles } from './Connections.styles';
import { connectionGroups } from '../../../constants/gameData'; 

const Connections = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [message, setMessage] = useState('');
  const [shuffledWords, setShuffledWords] = useState([]);
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
      const response = await fetch('/api/connections');
      const newGroups = await response.json();
      return newGroups;
    } catch (error) {
      console.error('Failed to fetch new connections:', error);
      return null;
    }
  };

  useEffect(() => {
    const allWords = connectionGroups.flatMap(group => 
      group.words.map(word => ({
        word,
        category: group.category,
        color: group.color || '#e0e0e0' 
      }))
    );
    setShuffledWords(shuffle([...allWords]));
  }, []);

  // Fisher-Yates shuffle algorithm
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleWordClick = (word) => {
    if (selectedWords.find(w => w.word === word.word)) {
      setSelectedWords(selectedWords.filter(w => w.word !== word.word));
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word]);
    }

    if (selectedWords.length === 3) {
      checkGroup([...selectedWords, word]);
    }
  };

  const checkGroup = (selected) => {
    const category = selected[0].category;
    const isCorrect = selected.every(word => word.category === category);

    if (isCorrect) {
      setMessage('Correct group!');
      setSolvedGroups([...solvedGroups, category]);
      setShuffledWords(shuffledWords.filter(word => 
        !selected.find(s => s.word === word.word)
      ));
    } else {
      setMessage('Try again!');
    }
    setSelectedWords([]);
  };

  return (
    <div style={styles.container}>
      <h2>Connections</h2>
      <p>Find groups of 4 related words</p>
      
      <div style={styles.grid}>
        {shuffledWords.map((wordObj, index) => (
          <div
            key={index}
            style={{
              ...styles.word,
              ...(selectedWords.find(w => w.word === wordObj.word) ? styles.selected : {}),
              ...(solvedGroups.includes(wordObj.category) ? { backgroundColor: wordObj.color } : {})
            }}
            onClick={() => handleWordClick(wordObj)}
          >
            {wordObj.word}
          </div>
        ))}
      </div>

      <div style={styles.message}>
        {message}
      </div>

      {solvedGroups.length > 0 && (
        <div style={styles.solved}>
          <h3>Solved Categories:</h3>
          {solvedGroups.map((category, index) => (
            <div key={index}>{category}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
