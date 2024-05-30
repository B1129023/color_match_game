import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';

// 導入所有遊戲組件
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
      <div>
        {!showGame && (
          <div className='App'>
            <div className='difficultySelect'>
              <header className='App-header'>
                <h1>Color Matching Game</h1>
              </header>
              <br></br><br></br><br></br>
              <br></br><br></br><br></br>
              <div>
                <label htmlFor="easy">
                  <input
                    type="radio"
                    id="easy"
                    name="difficulty"
                    value="easy"
                    checked={difficulty === 'easy'}
                    defaultChecked
                    onChange={handleDifficultyChange}
                  />
                  Easy
                </label>
                <label htmlFor="normal">
                  <input
                    type="radio"
                    id="normal"
                    name="difficulty"
                    value="normal"
                    checked={difficulty === 'normal'}
                    onChange={handleDifficultyChange}
                  />
                  Normal
                </label>
                <label htmlFor="hard">
                  <input
                    type="radio"
                    id="hard"
                    name="difficulty"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={handleDifficultyChange}
                  />
                  Hard
                </label>
              </div>
              <br></br>
              <button onClick={handleShowGame}>Start Game</button>
            </div>
          </div>
        )}
        {showGame && (
          <main>
            {selectedGame}
            <Link to="/">
              <button className='Home' onClick={() => setShowGame(false)}>Home</button>
            </Link>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;
