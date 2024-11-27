import React, { useState } from 'react';
import Navbar from './Navbar';
import GameCard from './GameCard';
import { games } from '../../constants/games';
import Connections from '../games/Connections';
import TicTacToe from '../games/TicTacToe';
import MemoryGame from '../games/MemoryGame';
import WordScramble from '../games/WordScramble';

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

const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--background-color)',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      width: '100%',
      padding: '20px',
    },
    gameGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
      padding: '24px',
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
    },
    gameContainer: {
      backgroundColor: 'var(--card-background)',
      borderRadius: '12px',
      padding: '24px',
      height: 'calc(100vh - 120px)',
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
  };
  

export default GameHub;

  
