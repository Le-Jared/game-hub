import React, { useState, useEffect } from 'react';

const Connections = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [message, setMessage] = useState('');
  
  // Example word groups (you can expand these)
  const wordGroups = [
    {
      category: "Colors",
      words: ["RED", "BLUE", "GREEN", "YELLOW"],
      color: "#ffd700"
    },
    {
      category: "Animals",
      words: ["LION", "TIGER", "BEAR", "WOLF"],
      color: "#90EE90"
    },
    {
      category: "Fruits",
      words: ["APPLE", "BANANA", "ORANGE", "GRAPE"],
      color: "#ff9999"
    },
    {
      category: "Countries",
      words: ["SPAIN", "FRANCE", "ITALY", "GREECE"],
      color: "#87CEEB"
    }
  ];

  // Flatten and shuffle words
  const [shuffledWords, setShuffledWords] = useState([]);
  const [solvedGroups, setSolvedGroups] = useState([]);

  useEffect(() => {
    const allWords = wordGroups.flatMap(group => 
      group.words.map(word => ({
        word,
        category: group.category,
        color: group.color
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

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginTop: '20px',
    },
    word: {
      padding: '15px',
      textAlign: 'center',
      border: '2px solid #ccc',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    selected: {
      backgroundColor: '#e0e0e0',
      border: '2px solid #000',
    },
    message: {
      textAlign: 'center',
      marginTop: '20px',
      fontWeight: 'bold',
    },
    solved: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
    }
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
