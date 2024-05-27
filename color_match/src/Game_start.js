import React from 'react';

class Game_start extends React.Component {
  render() {
    const { playerName, handleNameChange, startGame, difficulty, selectDifficulty } = this.props;

    return (
      <div>
        <header className="App-header">
          <h1>Color Matching Game</h1>
        </header>
        <div className='start_end'>
          <input 
            type="text" 
            value={playerName} 
            onChange={handleNameChange} 
            placeholder="Enter your name" 
          />
          <h2>Select Difficulty:</h2>
          <div className='difficulty-labels'>
            <label className='difficulty-label'>
              <input 
                type="radio" 
                name="difficulty" 
                defaultChecked
                value="easy"
                onChange={() => selectDifficulty("easy")}
              />
              Easy
            </label>
            <label className='difficulty-label'>
              <input 
                type="radio" 
                name="difficulty" 
                value="normal" 
                onChange={() => selectDifficulty("normal")}
              />
              Normal
            </label>
            <label className='difficulty-label'>
              <input 
                type="radio" 
                name="difficulty" 
                value="hard" 
                onChange={() => selectDifficulty("hard")}
              />
              Hard
            </label>
          </div>
          <button onClick={startGame}>Start Game</button>
        </div>
      </div>
    );
  }
}

export default Game_start;
