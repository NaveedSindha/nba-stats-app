import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import basketballLogo from './nba logo.svg';

/**
 * HoverLink Component
 * A custom Link component that changes appearance when hovered.
 * Props:
 * - to: target route
 * - children: text or elements inside the link
 * - style: base styles to apply
 */
function HoverLink({ to, children, style }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        background: hover ? '#ff1a1a' : '#a30000ff', // darker red on hover
        fontWeight: hover ? 'bold' : 'bold',         // can also increase bold if needed
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </Link>
  );
}
/**
 * Home Component
 * Landing page of the NBA Player Analytics Dashboard.
 * Displays the logo, title, subtitle, and navigation buttons to different features.
 */
function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={basketballLogo} alt="Basketball Logo" style={styles.logo} />
      </div>

      <h1 style={styles.title}>NBA Player Analytics Dashboard</h1>
      <p style={styles.subtitle}>
        Search player stats across various seasons and view their performances.
      </p>

      {/* Button Row */}
      <div style={styles.buttonRow}>
        <HoverLink to="/player" style={styles.button}>
          Player Stats
        </HoverLink>
        <HoverLink to="/compare-players" style={styles.button}>
          Compare Players
        </HoverLink>
      </div>
    </div>
  );
}
/**
 * Inline styling for Home component elements.
 * Using JS objects for styling to keep everything in one place.
 */
const styles = {
  container: {
    background: 'radial-gradient(circle at top, #1B1F3B 0%, #0D0F2C 50%, #1B1F3B 100%)',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: '15%',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  logo: {
    width: '600px',
    height: '600px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.2rem',
    maxWidth: '600px',
    marginBottom: '40px',
    lineHeight: '1.5',
    opacity: 0.9,
  },
  buttonRow: {
    display: 'flex',
    gap: '20px', // spacing between buttons
    justifyContent: 'center',
    marginBottom: '40px',
  },
  button: {
    background: '#a30000ff', // red accent
    color: '#fff',
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
  },
};

// Hover effect using inline styles: react doesn’t support :hover in objects directly
// For full hover, you can use a CSS file or styled-components

export default Home;
