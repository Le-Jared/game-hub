const GameCard = ({ game, onSelect }) => {
    return (
      <div
        style={styles.card}
        onClick={() => onSelect(game.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div style={styles.iconContainer}>
          {game.icon}
        </div>
        <h3 style={styles.title}>{game.title}</h3>
        <p style={styles.description}>{game.description}</p>
      </div>
    );
  };
  
  const styles = {
    card: {
      backgroundColor: 'var(--card-background)',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '280px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.05)',
    },
    iconContainer: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      color: 'var(--primary-color)',
    },
    title: {
      margin: '0 0 1rem 0',
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    description: {
      margin: 0,
      textAlign: 'center',
      color: '#666',
      fontSize: '1rem',
      lineHeight: '1.5',
    },
  };

export default GameCard;
  
