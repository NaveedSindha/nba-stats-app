import React, { useState } from 'react';

/**
 * ComparePlayers Component
 * Allows users to select multiple NBA players and compare their key statistics side-by-side.
 * Features:
 * - Dynamic autocomplete suggestions for player search
 * - Selection and removal of multiple players
 * - Season selection
 * - Fetch comparison data from backend API
 * - Highlight best/worst stats for easy comparison
 */
function ComparePlayers() {
  const [query, setQuery] = useState(''); // Input value for player search
  const [suggestions, setSuggestions] = useState([]);  // Autocomplete suggestions

  const [selected, setSelected] = useState([]); // List of currently selected players

  const [compare, setCompare] = useState(null); // Comparison data fetched from backend
  const [error, setError] = useState(''); // Error message display
  const [season, setSeason] = useState('2025-26');  // Selected season

  /**
   * onChange handler for player search input
   * - Updates input state
   * - Fetches autocomplete suggestions if input length >= 2
   */
  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/players?query=${encodeURIComponent(value)}`)
      .then(res => res.json())
      .then(data => setSuggestions(data.players || []))
      .catch(() => setSuggestions([]))
  };
  /**
   * selectedPlayer
   * Adds a player to the selection list if not already selected
   * Clears input and suggestions after selection
   */
  const selectedPlayer = (name) => {
    if (!selected.includes(name)) {
      setSelected([...selected, name]);
    }
    setQuery('');
    setSuggestions([]);
  };
  /**
   * removePlayer
   * Removes a player from the selected list
   */
  const removePlayer = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(player => player != name));
    }
  };

  /**
   * comparison
   * Fetches side-by-side comparison data for selected players
   * Requires at least 2 players to proceed
   */
  const comparison = () => {
    if (selected.length < 2) {
      setError("Please select at least 2 players to compare.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/compare?players=${encodeURIComponent(selected.join(','))}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        setCompare(data);
        setError('');
      })
      .catch(() => setError("Failed to get comparison."));
  };
  /**
   * getStatStyle
   * Highlights the highest and lowest values for a given stat across all compared players
   * - Best value: green and bold
   * - Worst value: red and bold
   */
  const getStatStyle = (statKey, currentValue) => {
    if (!compare) return {};

    const values = Object.values(compare)
      .map(p => p.summary[statKey])
      .filter(v => v !== null && v !== undefined);

    if (values.length < 2) return {};

    const max = Math.max(...values);
    const min = Math.min(...values);

    if (currentValue === max && max !== min) {
      return { color: '#4CAF50', fontWeight: 'bold' }; // green
    }

    if (currentValue === min && max !== min) {
      return { color: '#FF4C4C', fontWeight: 'bold' }; // red
    }

    return {};
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Compare NBA Players</h2>
      <p style={styles.subtitle}>Select multiple players to see a side-by-side comparison.</p>


      <div style={styles.inputGroup}>
        {/* Selected Players */}
        <div style={styles.selectedContainer}>
          {selected.map((p, i) => (
            <div key={i} style={styles.selectedItem}>
              {p} <span style={styles.remove} onClick={() => removePlayer(p)}>✕</span>
            </div>
          ))}
        </div>


        {/* Input + Suggestions */}
        <input
          type="text"
          placeholder="Type a player name..."
          value={query}
          onChange={onChange}
          style={styles.input}
        />
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          style={styles.select}
        >
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

          {/* Autocomplete suggestions: displayed when user types 2+ characters */}
        </select>
        {suggestions.length > 0 && (
          <ul style={styles.suggestionList}>
            {suggestions.map((s, i) => (
              <li
                key={i}
                style={styles.suggestionItem}
                onClick={() => selectedPlayer(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>


      <button onClick={comparison} style={styles.button}>Compare</button>


      {error && <p style={styles.error}>{error}</p>}


      {/* Comparison Results */}
      {compare && (
        <div style={styles.results}>
          {Object.values(compare).map((playerData, idx) => (
            <div key={idx} style={styles.card}>
              {playerData.summary.player_id && (
                <img
                  src={`https://cdn.nba.com/headshots/nba/latest/260x190/${playerData.summary.player_id}.png`}
                  alt={playerData.summary.player_name}
                  style={styles.image}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <h3>{playerData.summary.player_name}</h3>
              <p>Games: {playerData.summary.games_played}</p>
              <p style={getStatStyle('avg_points', playerData.summary.avg_points)}>
                PTS Avg: {playerData.summary.avg_points}
              </p>
              <p style={getStatStyle('avg_assists', playerData.summary.avg_assists)}>
                AST AVG: {playerData.summary.avg_assists}
              </p>
              <p style={getStatStyle('avg_rebounds', playerData.summary.avg_rebounds)}>
                REB AVG: {playerData.summary.avg_rebounds}
              </p>
              <p style={getStatStyle('fg_pct', playerData.summary.fg_pct)}>
                FG% AVG: {playerData.summary.fg_pct}%
              </p>
              <p style={getStatStyle('fg3_pct', playerData.summary.fg3_pct)}>
                3P% AVG: {playerData.summary.fg3_pct}%
              </p>
              <p style={getStatStyle('ft_pct', playerData.summary.ft_pct)}>
                FT% AVG: {playerData.summary.ft_pct}%
              </p>
              <p style={getStatStyle('ft_pct', playerData.summary.ft_pct)}>
                FT% AVG: {playerData.summary.ft_pct}%
              </p>
              <p style={getStatStyle('ft_pct', playerData.summary.ft_pct)}>
                FT% AVG: {playerData.summary.ft_pct}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline styles for ComparePlayers component.
 * Maintains a clean layout and highlights for comparison results.
 */
const styles = {
  container: { padding: '40px', minHeight: '100vh', backgroundColor: '#1b1b3a', color: '#fff', fontFamily: 'Arial, sans-serif', textAlign: 'center' },
  title: { fontSize: '2.5em', fontWeight: 'bold', marginBottom: '10px' },
  subtitle: { marginBottom: '20px', opacity: 0.9 },
  inputGroup: { position: 'relative', width: '400px', margin: '0 auto 20px' },
  input: { padding: '10px', width: '100%', fontSize: '1em', borderRadius: '5px' },
  suggestionList: { position: 'absolute', top: '42px', left: 0, right: 0, backgroundColor: '#2c2c5a', listStyle: 'none', margin: 0, padding: 0, borderRadius: '5px', maxHeight: '200px', overflowY: 'auto', zIndex: 10 },
  suggestionItem: { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #444' },
  selectedContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '10px' },
  selectedItem: { backgroundColor: '#ff4d4d', color: '#fff', padding: '5px 10px', borderRadius: '15px', margin: '3px', display: 'flex', alignItems: 'center' },
  remove: { marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold' },
  button: { padding: '10px 25px', fontSize: '1em', backgroundColor: '#FF4C4C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' },
  results: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginTop: '20px' },
  card: { backgroundColor: '#2c2c5a', padding: '20px', borderRadius: '12px', minWidth: '250px', textAlign: 'center' },
  image: { width: '80px', borderRadius: '50%', marginBottom: '10px' },
  error: { color: '#ff4d4d', marginTop: '10px' }
};

export default ComparePlayers;
