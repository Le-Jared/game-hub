import React from 'react';

const Navbar = ({ onHome }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={onHome}>
        🎮 Game Lah
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2196f3',
    padding: '1rem',
    color: 'white',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Navbar;
