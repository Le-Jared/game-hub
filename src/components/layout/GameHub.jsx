import React, { useState } from 'react';
import Navbar from './Navbar';
import GameCard from './GameCard';
import { games } from '../../constants/games';
import Connections from '../games/Connections/Connections';
import MemoryGame from '../games/MemoryGame/MemoryGame';
import WordScramble from '../games/WordScramble/WordScramble';

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleHome = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'connections':
        return <Connections />;
      case 'tictactoe':
        return <TicTacToe />;
      case 'memory':
        return <MemoryGame />;
      case 'wordscramble':
        return <WordScramble />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <Navbar onHome={handleHome} />
      <div style={styles.content}>
        {!selectedGame ? (
          <div style={styles.gameGrid}>
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleGameSelect}
              />
            ))}
          </div>
        ) : (
          <div style={styles.gameContainer}>
            {renderGame()}
          </div>
        )}
      </div>
    </div>
  );
};

export const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  gameInfo: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  timer: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    textAlign: 'center',
    margin: '12px 0',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontWeight: 'bold',
  },
  gameBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
    minHeight: 0,
  },
  wordGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 'clamp(8px, 2vw, 12px)',
    marginBottom: '20px',
  },
  wordButton: {
    padding: 'clamp(10px, 2vw, 15px)',
    textAlign: 'center',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedGroups: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: 'auto',
  },
  solvedGroup: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
  },
  gameOver: {
    textAlign: 'center',
    padding: 'clamp(20px, 4vw, 30px)',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    margin: 'auto',
    maxWidth: '100%',
  },
  button: {
    padding: '12px 24px',
    fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    marginTop: '20px',
    minWidth: '120px',
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    color: '#333',
    margin: '0',
  },
  finalScore: {
    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
    color: '#333',
    marginTop: '10px',
  },
  categoriesSolved: {
    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
    color: '#666',
    marginTop: '10px',
  }
};
  

export default GameHub;

  
