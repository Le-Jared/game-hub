export const colors = {
    primary: '#2196f3',
    secondary: '#f50057',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    light: '#f5f5f5',
    dark: '#333333',
    white: '#ffffff',
    black: '#000000',
    gray: '#9e9e9e',
  };
  
  export const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  };
  
  export const typography = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  };
  
  export const borders = {
    radius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%',
    },
  };
  
  export const shadows = {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  };
  
  export const transitions = {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  };
  
  export const gameCardStyles = {
    container: {
      backgroundColor: colors.white,
      borderRadius: borders.radius.medium,
      padding: spacing.md,
      margin: spacing.sm,
      boxShadow: shadows.small,
      transition: transitions.default,
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.medium,
      },
    },
  };
  
  export const buttonStyles = {
    base: {
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: borders.radius.medium,
      border: 'none',
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.medium,
      fontWeight: typography.fontWeight.medium,
      transition: transitions.default,
    },
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
      '&:hover': {
        backgroundColor: '#1976d2',
      },
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.white,
      '&:hover': {
        backgroundColor: '#c51162',
      },
    },
  };
  
  export const layoutStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.md} ${spacing.lg}`,
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: spacing.md,
    },
  };
  