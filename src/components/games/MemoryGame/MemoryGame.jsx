import React, { useState, useEffect } from 'react';
import { memoryCards } from '../../../constants/gameData';
import { styles } from './MemoryGame.styles';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isActive && score < memoryCards.length) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, score]);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...memoryCards, ...memoryCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setScore(0);
    setMoves(0);
    setTimer(0);
    setIsActive(true);
    setStreak(0);
  };

  // Handle choice
  const handleChoice = (card) => {
    if (disabled) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      setMoves(prev => prev + 1);

      if (choiceOne.emoji === choiceTwo.emoji) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.emoji === choiceOne.emoji) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
        setBestStreak(prev => Math.max(prev, streak + 1));
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
          setStreak(0);
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset choices
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  // Start game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  // Stop timer when game is complete
  useEffect(() => {
    if (score === memoryCards.length) {
      setIsActive(false);
    }
  }, [score]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Memory Game</h2>
        <button style={styles.button} onClick={shuffleCards}>
          New Game
        </button>
      </div>

      <div style={styles.stats}>
        <div>Time: {formatTime(timer)}</div>
        <div>Moves: {moves}</div>
        <div>Matches: {score}</div>
        <div>Streak: {streak}</div>
        <div>Best Streak: {bestStreak}</div>
      </div>

      <div style={styles.grid}>
        {cards.map(card => (
          <div 
            key={card.id} 
            style={styles.card}
            onClick={() => handleChoice(card)}
          >
            <div style={{
              ...styles.cardInner,
              transform: card.matched || card === choiceOne || card === choiceTwo 
                ? 'rotateY(180deg)' 
                : 'rotateY(0)'
            }}>
              <div style={styles.cardFront}>?</div>
              <div style={styles.cardBack}>{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {score === memoryCards.length && (
        <div style={styles.victoryMessage}>
          Congratulations! You've completed the game in {moves} moves and {formatTime(timer)}!
          <br />
          Best Streak: {bestStreak}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

