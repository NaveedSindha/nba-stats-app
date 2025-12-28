import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * HoverButton Component
 * A custom button component that changes appearance when hovered.
 * Props:
 * - onClick: function to handle click events
 * - children: button label or content
 * - style: base inline styles to apply
 */
function HoverButton({ onClick, children, style }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} // Enable hover effect
      onMouseLeave={() => setHover(false)} // Disable hover effect
      style={{
        ...style,
        backgroundColor: hover ? '#ff1a1a' : '#ff4d4d', // darker red on hover
        fontWeight: hover ? 'bold' : 'normal',          // bold on hover
        transition: 'all 0.2s ease', // smooth transition
        cursor: 'pointer' // Pointer cursor on hover
      }}
    >
      {children}
    </button>
  );
}
/**
 * PlayerStats Component
 * Main component to search NBA players and display their game stats.
 * Features:
 * - Player name input with dynamic autocomplete suggestions
 * - Season selection
 * - Fetch and display player stats from backend API
 * - Display summary stats and a bar chart visualization
 */
function PlayerStats() {
  const [player, setPlayer] = useState(''); // Currently typed player name
  const [stats, setStats] = useState(null); // Fetched stats data
  const [error, setError] = useState(''); // Error message for invalid input
  const [suggestions, setSuggestions] = useState([]); // Autocomplete suggestions
  const [season, setSeason] = useState('2025-26'); // Selected season


  /**
   * onChange handler for player input
   * - Updates input state
   * - Fetches autocomplete suggestions dynamically if input length >= 2
   */
  const onChange = (e) => {
    const value = e.target.value;
    setPlayer(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/players?query=${encodeURIComponent(value)}`)
      .then(res => res.json())
      .then(data => setSuggestions(data.players || []))
      .catch(() => setSuggestions([]));
  };

  /**
   * fetchStats
   * Fetches stats for the selected player and season from backend API
   * Updates stats state and handles errors
   */
  const fetchStats = (name) => {
    if (!name) return;

    fetch(`http://127.0.0.1:8000/api/player/${encodeURIComponent(name)}?season=${season}`)
      .then(res => {
        if (!res.ok) throw new Error('Player not found');
        return res.json();
      })
      .then(data => {
        if (!data || !data.summary || data.summary.games_played === 0) {
          // If the player exists but has no games data
          setStats(null);
          setError('Stats not available for this player.');
        } else {
          setStats(data);
          setError('');
        }
        setSuggestions([]);
      })
      .catch(() => {
        setStats(null);
        setError('Player not found.');
      });
  };

  /**
   * selectPlayer
   * Sets player input to selected suggestion and fetches stats
   */
  const selectPlayer = (name) => {
    setPlayer(name);
    fetchStats(name);
  };

  /**
   * chartData
   * Formats stats data into a structure compatible with Recharts BarChart
   */
  const chartData = stats
    ? [
      { name: 'Points', value: stats.summary.avg_points },
      { name: 'Assists', value: stats.summary.avg_assists },
      { name: 'Rebounds', value: stats.summary.avg_rebounds },
      { name: 'FG%', value: stats.summary.fg_pct },
      { name: '3P%', value: stats.summary.fg3_pct },
      { name: 'FT%', value: stats.summary.ft_pct },
      { name: 'TS%', value: stats.summary.ts_pct },
    ]
    : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Player Stats</h2>
      <p style={styles.subtitle}>Search NBA players and view their stats across various seasons.</p>

      <div style={styles.inputGroup}>
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Enter player name"
            value={player}
            onChange={onChange}
            style={styles.input}
          />
          <HoverButton onClick={() => fetchStats(player)} style={styles.button}>
            Search
          </HoverButton>

          <select value={season} onChange={(e) => setSeason(e.target.value)} style={styles.select}>

            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
            <option value="2021-22">2021-22</option>
            <option value="2019-20">2019-20</option>
            <option value="2018-19">2018-19</option>
            <option value="2017-18">2017-18</option>
            <option value="2016-17">2016-17</option>
            <option value="2015-16">2015-16</option>
            <option value="2014-15">2014-15</option>
            <option value="2013-14">2013-14</option>
            <option value="2012-13">2012-13</option>
            <option value="2011-12">2011-12</option>
            <option value="2010-11">2010-11</option>
            <option value="2009-10">2009-10</option>
            <option value="2008-09">2008-09</option>
            <option value="2007-08">2007-08</option>
            <option value="2006-07">2006-07</option>
            <option value="2005-06">2005-06</option>
            <option value="2004-05">2004-05</option>
            <option value="2003-04">2003-04</option>
            <option value="2002-03">2002-03</option>
            <option value="2001-02">2001-02</option>
            <option value="2000-01">2000-01</option>
            <option value="1999-00">1999-00</option>
            <option value="1998-99">1998-99</option>
            <option value="1997-98">1997-98</option>
            <option value="1996-97">1996-97</option>

          </select>

        </div>

        {/* Autocomplete */}
        {suggestions.length > 0 && (
          <ul style={styles.suggestionList}>
            {suggestions.map((s, i) => (
              <li
                key={i}
                style={styles.suggestionItem}
                onClick={() => selectPlayer(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {stats?.summary && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
          <div style={styles.card}>
            {stats.summary.player_id && (
              <img
                src={`https://cdn.nba.com/headshots/nba/latest/260x190/${stats.summary.player_id}.png`}
                alt={stats.summary.player_name}
                style={styles.image}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h3 style={styles.playerName}>{stats.summary.player_name}</h3>
            <p>Games Played: {stats.summary.games_played}</p>
            <p>PTS AVG: {stats.summary.avg_points}</p>
            <p>AST AVG: {stats.summary.avg_assists}</p>
            <p>REB AVG: {stats.summary.avg_rebounds}</p>
            <p>FG% AVG: {stats.summary.fg_pct}%</p>
            <p>3P% AVG: {stats.summary.fg3_pct}%</p>
            <p>FT% AVG: {stats.summary.ft_pct}%</p>
            <p>TS% AVG: {stats.summary.ts_pct}%</p>
            <p>+/-: {stats.summary.plus_minus}</p>
          </div>

          <div style={{ width: '550px', height: '300px', backgroundColor: '#2c2c5a', borderRadius: '12px', padding: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#fff"
                  tick={{ fill: '#fff', fontSize: 12 }}
                  interval={0}
                  angle={0}
                  dx={15}
                  textAnchor="end"
                />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FF4D4D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline styles for PlayerStats component.
 * Using JS objects for styling to maintain component self-containment.
 */
const styles = {
  container: {
    padding: '40px',
    minHeight: '100vh',
    backgroundColor: '#1b1b3a',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    marginBottom: '20px',
    opacity: 0.9,
  },
  inputGroup: {
    position: 'relative',
    width: '360px',
    margin: '0 auto',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    width: '150px',
    fontSize: '1em',
  },
  select: {
    padding: '10px',
    fontSize: '1em',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  suggestionList: {
    position: 'absolute',
    top: '45px',
    left: 0,
    right: 0,
    backgroundColor: '#2c2c5a',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    borderRadius: '5px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #444',
  },
  error: {
    color: '#ff4d4d',
    marginTop: '15px',
  },
  card: {
    padding: '25px',
    backgroundColor: '#2c2c5a',
    borderRadius: '12px',
    minWidth: '250px',
  },
  playerName: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  image: {
    width: '80px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
};

export default PlayerStats;
