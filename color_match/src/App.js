import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// 導入所有遊戲組件
import EasyGame from './easy_game';
import NormalGame from './normal_game';
import HardGame from './hard_game';
import TimedGame from './timed_game'; // 新的限時模式遊戲組件

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
  switch (difficulty) {
    case 'easy':
      selectedGame = <EasyGame />;
      break;
    case 'normal':
      selectedGame = <NormalGame />;
      break;
    case 'hard':
      selectedGame = <HardGame />;
      break;
    case 'timed':
      selectedGame = <TimedGame />;
      break;
    default:
      selectedGame = null;
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
              <br />
              <div>
                <label htmlFor="easy">
                  <input
                    type="radio"
                    id="easy"
                    name="difficulty"
                    value="easy"
                    checked={difficulty === 'easy'}
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
                <label htmlFor="timed">
                  <input
                    type="radio"
                    id="timed"
                    name="difficulty"
                    value="timed"
                    checked={difficulty === 'timed'}
                    onChange={handleDifficultyChange}
                  />
                  Timed-Limited
                </label>
              </div>
              <br />
              <button onClick={handleShowGame}>Select Difficulty</button>
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
