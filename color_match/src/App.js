import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';

// 导入所有游戏组件
import EasyGame from './easy_game';
import NormalGame from './normal_game';
import HardGame from './hard_game';

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [showGame, setShowGame] = useState(false);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleShowGame = () => {
    setShowGame(true);
  };

  let selectedGame;
  if (showGame) {
    if (difficulty === 'easy') {
      selectedGame = <EasyGame />;
    } else if (difficulty === 'normal') {
      selectedGame = <NormalGame />;
    } else if (difficulty === 'hard') {
      selectedGame = <HardGame />;
    }
  }

  return (
    <Router>
      <div className="App">
        {!showGame && (
          <div className="difficulty-select">
            <header className="App-header">
            <h1>Color Matching Game</h1>
            </header>
            <br></br><br></br><br></br>
            <br></br><br></br><br></br>
            <label>
              Select Difficulty:
              <select value={difficulty} onChange={handleDifficultyChange}>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <button onClick={handleShowGame}>Start Game</button>
          </div>
        )}
        {showGame && (
          <main>  
            {selectedGame}
            <Link to="/">
              <button onClick={() => setShowGame(false)}>Home</button>
            </Link>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;
