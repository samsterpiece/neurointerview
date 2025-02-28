// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  body {
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding: 0;
    width: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', 'Roboto', 'Helvetica Neue', sans-serif;
    color: ${({ theme }) => theme.colors.heading};
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  button {
    cursor: pointer;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* For users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyle;

// src/styles/theme.js
const theme = {
  colors: {
    primary: '#1e3a8a',
    primaryLight: '#2563eb',
    primaryDark: '#1e40af',
    secondary: '#64748b',
    secondaryLight: '#94a3b8',
    secondaryDark: '#475569',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#334155',
    textLight: '#64748b',
    heading: '#1e293b',
    border: '#e2e8f0',
    borderDark: '#cbd5e1',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  borderRadius: {
    sm: '0.125rem',  // 2px
    md: '0.25rem',   // 4px
    lg: '0.5rem',    // 8px
    xl: '1rem',      // 16px
    rounded: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    footer: 600,
  },
};

export default theme;

// src/styles/components.js - Reusable styled components
import styled from 'styled-components';