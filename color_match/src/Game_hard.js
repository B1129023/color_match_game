import React, { Component } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

class HardGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      targetColor: '',
      playerName: '',
      gameOver: false,
      score: 0,
      timeLeft: 3, // 3秒倒數
      leaderboardHard: [],
    };
    this.existingPositions = [];
  }

  componentDidMount() {
    // 從本地存儲中加載排行榜數據
    const storedLeaderboardHard = localStorage.getItem('leaderboardHard');
    if (storedLeaderboardHard) {
      this.setState({ leaderboardHard: JSON.parse(storedLeaderboardHard) });
    }
  }

  // 保存分數
  saveScore = async () => {
    const { playerName, score } = this.state;
    try {
      await addDoc(collection(db, 'hard_gameScores'), { playerName, score });
      this.updateLeaderboard();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  // 更新排行榜
  updateLeaderboard = async () => {
    const scoresQuery = query(collection(db, 'hard_gameScores'), orderBy('score', 'desc'));
    const querySnapshot = await getDocs(scoresQuery);
    const allScores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const topScores = allScores.sort((a, b) => b.score - a.score).slice(0, 5);

    this.setState({ leaderboardHard: topScores });
    localStorage.setItem('leaderboardHard', JSON.stringify(topScores)); // 保存到本地存儲

    if (allScores.length > 5) {
      const scoresToDelete = allScores.filter(score => !topScores.includes(score));
      scoresToDelete.forEach(async (scoreDoc) => {
        await deleteDoc(doc(db, 'hard_gameScores', scoreDoc.id));
      });
    }
  }

  tick = () => {
    const { gameStarted, timeLeft } = this.state;
    this.existingPositions = [];
    if (gameStarted && timeLeft > 0) {
      this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1 }));
    } else if (gameStarted && timeLeft === 0) {
      this.endGame();
    }
  }

  handleNameChange = (event) => {
    this.setState({ playerName: event.target.value });
  }

  startGame = () => {
    this.timerID = setInterval(this.tick, 1000); // 每秒更新一次時間
    const targetColor = this.getRandomColor();
    if (this.state.playerName === '') {
      this.setState({ playerName: 'player' });
    }
    this.setState({
      gameStarted: true,
      targetColor: targetColor,
      gameOver: false,
      score: 0,
      targetColorName: targetColor,
      timeLeft: 3, // 重新設置倒數時間為3秒
    });
  }

  endGame = () => {
    this.setState({ gameOver: true });
    clearInterval(this.timerID);
    this.saveScore(); // 先保存分數
    this.updateLeaderboard(); // 更新排行榜
  }

  restartGame = () => {
    clearInterval(this.timerID);
    this.setState({
      gameStarted: false,
      targetColor: '',
      playerName: '',
      gameOver: false,
      score: 0,
      timeLeft: 3, // 3秒倒數
    });
    this.existingPositions = [];
  }

  getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  getRandomPosition = () => {
    const blockSize = 80; // 方塊大小
    const edge_length = 490; // 方塊邊長(根據需要調整)

    let isValidPosition = false;
    let top, left;

    const generatePosition = () => {
      top = Math.floor(Math.random() * (edge_length)) + 20;
      left = Math.floor(Math.random() * (edge_length)) + 365;

      isValidPosition = this.existingPositions.every(position => {
        const { top: existingTop, left: existingLeft } = position;
        return (
          top + blockSize < existingTop ||
          left + blockSize < existingLeft ||
          top > existingTop + blockSize ||
          left > existingLeft + blockSize
        );
      });
    };

    generatePosition();

    while (!isValidPosition) {
      generatePosition();
    }

    this.existingPositions.push({ top, left });

    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${blockSize}px`,
      height: `${blockSize}px`,
    };
  }

  getPosition = (top, left, blockSize) => {
    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${blockSize}px`,
      height: `${blockSize}px`,
    };
  }

  handleBlockClick = (clickedColor) => {
    const { targetColor } = this.state;
    if (clickedColor === targetColor) {
      clearInterval(this.timerID);
      this.timerID = setInterval(this.tick, 1000); // 每秒更新一次時間
      this.setState(prevState => ({
        targetColor: this.getRandomColor(),
        score: prevState.score + 1,
        timeLeft: 3, // 重新設置倒數時間
      }));
      this.existingPositions = [];
    } else {
      // 直接呼叫endGame()結束遊戲，避免時間倒數到0時再次呼叫endGame()，造成分數重複計算
      this.endGame();
    }
  }

  render() {
    const { gameStarted, targetColor, gameOver, score, timeLeft, playerName, leaderboardHard } = this.state;
    return (
      <div>
        {gameStarted === false && (
          <div>
            <header className="App-header">
              <h1>Color Matching Game (Hard)</h1>
            </header>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className='start_end'>
            <h1>Hard Mode</h1>
              <input
                type="text"
                value={playerName}
                onChange={this.handleNameChange}
                placeholder="Enter your name"
              />
              <button onClick={this.startGame}>Start Game</button>
            </div>
          </div>
        )}
        {gameStarted && gameOver === false && (
          <div>
            <h2>Time Left: {timeLeft}</h2>
            <h2>Score: {score}</h2>
            <h2>Target Color:</h2>
            <div style={{ backgroundColor: 'black', ...this.getPosition(17, 362, 576) }}></div>
            <div style={{ backgroundColor: 'lightcyan', ...this.getPosition(20, 365, 570) }}></div>
            <div style={{ backgroundColor: targetColor, ...this.getPosition(215, 13, 80) }}></div>
            <div style={{ backgroundColor: targetColor, ...this.getRandomPosition() }} onClick={() => this.handleBlockClick(targetColor)}></div>

            <div style={{ backgroundColor: this.getRandomColor(), ...this.getRandomPosition() }} onClick={() => this.handleBlockClick()}></div>
          </div>
        )}
        {gameOver && (
          <div>
            <header className="App-header">
              <h1>Color Matching Game (Hard)</h1>
            </header>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className='start_end'>
              <h2 className='game-over-message'>Game Over!</h2>
              <div>Final Score for {playerName}: {score}</div>
              <button onClick={this.restartGame}>Restart Game</button>
              <div className="leaderboards">
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
        )}
      </div>
    );
  }
}

export default HardGame;

