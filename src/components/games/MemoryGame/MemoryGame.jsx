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
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Memory Game</h2>
        <button style={styles.button} onClick={shuffleCards}>
          New Game
        </button>
      </div>

      <div style={styles.stats}>
        <div>Moves: {moves}</div>
        <div>Matches: {score}</div>
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
          Congratulations! You've completed the game in {moves} moves!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

