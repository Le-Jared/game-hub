export const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
  
    gameHeader: {
      marginBottom: '20px'
    },
  
    title: {
      fontSize: '2rem',
      color: '#2c3e50',
      marginBottom: '15px'
    },
  
    scoreBoard: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      margin: '10px 0'
    },
  
    scoreText: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#34495e'
    },
  
    message: {
      color: '#e74c3c',
      height: '20px',
      margin: '10px 0',
      fontSize: '1rem'
    },
  
    currentWord: {
      fontSize: '2rem',
      height: '40px',
      margin: '20px 0',
      letterSpacing: '2px',
      color: '#2c3e50',
      fontWeight: 'bold'
    },
  
    honeycomb: {
      position: 'relative',
      width: '300px',
      height: '300px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    letter: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        position: 'absolute',
        transition: 'transform 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',          
        justifyContent: 'center',  
        alignItems: 'center',     
        '&:hover': {
          transform: 'scale(1.1)'
        }
    },
  
    centerLetter: {
      backgroundColor: '#f1c40f',
      color: '#fff',
      zIndex: 1
    },
  
    outerLetter: {
      backgroundColor: '#ecf0f1',
      color: '#2c3e50'
    },
  
    // Positions for outer letters
    outerLetterPositions: [
      { transform: 'translate(0, -100px)' },
      { transform: 'translate(86.6px, -50px)' },
      { transform: 'translate(86.6px, 50px)' },
      { transform: 'translate(0, 100px)' },
      { transform: 'translate(-86.6px, 50px)' },
      { transform: 'translate(-86.6px, -50px)' }
    ],
  
    controls: {
      margin: '20px 0',
      display: 'flex',
      justifyContent: 'center',
      gap: '15px'
    },
  
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    },
  
    deleteButton: {
      backgroundColor: '#e74c3c',
      '&:hover': {
        backgroundColor: '#c0392b'
      }
    },
  
    foundWordsContainer: {
      marginTop: '20px',
      textAlign: 'left'
    },
  
    foundWordsTitle: {
      fontSize: '1.2rem',
      color: '#2c3e50',
      marginBottom: '10px'
    },
  
    wordsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px'
    },
  
    foundWord: {
      backgroundColor: '#f0f0f0',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '14px',
      color: '#2c3e50'
    },
  
    // Media query for smaller screens
    '@media (max-width: 600px)': {
      honeycomb: {
        transform: 'scale(0.8)'
      },
      container: {
        padding: '10px'
      }
    },

    instructionsButton: {
        background: 'none',
        border: 'none',
        color: '#3498db',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '1rem',
        marginBottom: '10px'
      },
      
      instructions: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'left'
      },
      
      instructionsList: {
        listStyle: 'disc',
        paddingLeft: '20px',
        margin: '10px 0'
      },
      
      instructionsText: {
        fontSize: '0.9rem',
        lineHeight: '1.4',
        color: '#2c3e50'
      },
      
  };
  