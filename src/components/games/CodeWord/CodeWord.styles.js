export const styles = {
    codewordContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto'
    },
  
    gameBoard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      margin: '20px 0'
    },
  
    guessRow: {
      display: 'flex',
      gap: '5px'
    },
  
    guessCell: {
      width: '50px',
      height: '50px',
      border: '2px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
  
    guessCellCorrect: {
      backgroundColor: '#6aaa64',
      color: 'white',
      borderColor: '#6aaa64'
    },
  
    guessCellPresent: {
      backgroundColor: '#c9b458',
      color: 'white',
      borderColor: '#c9b458'
    },
  
    guessCellAbsent: {
      backgroundColor: '#787c7e',
      color: 'white',
      borderColor: '#787c7e'
    },
  
    keyboard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '20px'
    },
  
    keyboardRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '6px'
    },
  
    key: {
      padding: '15px',
      minWidth: '30px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#d3d6da',
      fontWeight: 'bold',
      cursor: 'pointer',
      textTransform: 'uppercase',
      '&:hover': {
        opacity: '0.8'
      }
    },
  
    keyCorrect: {
      backgroundColor: '#6aaa64',
      color: 'white'
    },
  
    keyPresent: {
      backgroundColor: '#c9b458',
      color: 'white'
    },
  
    keyAbsent: {
      backgroundColor: '#787c7e',
      color: 'white'
    },
  
    message: {
      margin: '20px 0',
      padding: '10px',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  };
  