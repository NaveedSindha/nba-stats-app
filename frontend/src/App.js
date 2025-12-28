import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import ComparePlayers from './pages/ComparePlayers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<PlayerStats />} />
         <Route path="/compare-players" element={<ComparePlayers />} />
      </Routes>
    </Router>
  );
}

export default App;
