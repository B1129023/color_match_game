import React from 'react';

class Game_end extends React.Component {
  render() {
    const { playerName, score, restartGame, leaderboardEasy, leaderboardNormal, leaderboardHard } = this.props;

    return (
      <div>
        <header className="App-header">
          <h1>Color Matching Game</h1>
        </header>
        <div className='start_end'>
          <h2 className='game-over-message'>Game Over!</h2>
          <div>Final Score for {playerName}: {score}</div>
          <button onClick={restartGame}>Restart Game</button>
          <div className="leaderboards">
            <div className="leaderboard">
              <h2>Leaderboard (Easy)</h2>
              <ul className="leaderboard">
                {leaderboardEasy.map((entry, index) => (
                  <li key={index}>{entry.playerName}: {entry.score}</li>
                ))}
              </ul>
            </div>
            <div className="leaderboard">
              <h2>Leaderboard (Normal)</h2>
              <ul className="leaderboard">
                {leaderboardNormal.map((entry, index) => (
                  <li key={index}>{entry.playerName}: {entry.score}</li>
                ))}
              </ul>
            </div>
            <div className="leaderboard">
              <h2>Leaderboard (Hard)</h2>
              <ul className="leaderboard">
                {leaderboardHard.map((entry, index) => (
                  <li key={index}>{entry.playerName}: {entry.score}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game_end;
