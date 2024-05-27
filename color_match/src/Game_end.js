import React from 'react';

const GameEnd = ({ playerName, score, restartGame, leaderboardEasy, leaderboardNormal, leaderboardHard }) => {
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
            <table className="leaderboard">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardEasy.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.playerName}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="leaderboard">
            <h2>Leaderboard (Normal)</h2>
            <table className="leaderboard">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardNormal.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.playerName}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="leaderboard">
            <h2>Leaderboard (Hard)</h2>
            <table className="leaderboard">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardHard.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.playerName}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEnd;
