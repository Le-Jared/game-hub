export const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
    },
    baseWord: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: '20px 0',
      color: '#2c3e50',
      letterSpacing: '3px',
    },
    input: {
      padding: '10px 15px',
      fontSize: '1.2rem',
      marginRight: '10px',
      borderRadius: '5px',
      border: '2px solid #3498db',
      width: '200px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1.1rem',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '5px',
    },
    foundWordsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      margin: '20px 0',
    },
    foundWord: {
      padding: '5px 10px',
      backgroundColor: '#2ecc71',
      color: 'white',
      borderRadius: '15px',
      fontSize: '0.9rem',
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
    },
    message: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '5px',
      transition: 'all 0.3s ease',
    },
    loading: {
      fontSize: '1.2rem',
      color: '#666',
      margin: '20px 0',
    },
    instructionsModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    instructionsContent: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%'
    },
    
    instructionsList: {
      textAlign: 'left',
      marginBottom: '1.5rem'
    },
    
    startScreen: {
      textAlign: 'center',
      marginBottom: '2rem'
    }
};
