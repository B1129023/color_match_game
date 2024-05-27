import React, { Component } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      targetColor: '',
      playerName: '',
      gameOver: false,
      score: 0,
      timeLeft: 5, // 5秒倒數
      leaderboard: [] // 添加排行榜的状态
    };
    this.existingPositions = [];
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
      timeLeft: 5 // 重新設置倒數時間
    });
  }

  handleNameChange = (event) => {
    this.setState({ playerName: event.target.value });
  }

  handleBlockClick = (clickedColor) => {
    const { targetColor } = this.state;
    if (clickedColor === targetColor) {
      clearInterval(this.timerID);
      this.timerID = setInterval(this.tick, 1000); // 每秒更新一次時間
      this.setState(prevState => ({
        targetColor: this.getRandomColor(),
        score: prevState.score + 1,
        timeLeft: 5 // 重新設置倒數時間
      }));
      this.existingPositions = [];
    } else {
      this.setState({ gameOver: true });
      this.saveScore();
    }
  }

  endGame = () => {
    clearInterval(this.timerID);
    this.setState({ gameOver: true });
    this.saveScore();
  }

  saveScore = async () => {
    const { playerName, score } = this.state;
    try {
      await addDoc(collection(db, 'gameScores'), {
        playerName,
        score,
        timestamp: new Date()
      });
      console.log('Score saved successfully');
      this.updateLeaderboard();
    } catch (error) {
      console.error('Error saving score: ', error);
    }
  }

  updateLeaderboard = async () => {
    const scoresQuery = query(collection(db, 'gameScores'), orderBy('score', 'desc'), limit(5));
    const querySnapshot = await getDocs(scoresQuery);
    const topScores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    this.setState({ leaderboard: topScores });

    const allScoresQuery = query(collection(db, 'gameScores'), orderBy('score', 'desc'));
    const allScoresSnapshot = await getDocs(allScoresQuery);
    const allScores = allScoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (allScores.length > 5) {
      const scoresToDelete = allScores.slice(5);
      scoresToDelete.forEach(async (scoreDoc) => {
        await deleteDoc(doc(db, 'gameScores', scoreDoc.id));
      });
    }
  }

  getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  getRandomPosition = () => {
    const blockSize = 80; // Size of the block
    const containerWidth = 850; // Width of the container (adjust according to your needs)
    const containerHeight = 400; // Height of the container (adjust according to your needs)

    let top, left;
    let isValidPosition = false;

    while (!isValidPosition) {
        top = Math.floor(Math.random() * (containerHeight)) + 130;
        left = Math.floor(Math.random() * (containerWidth)) + 200;

        // Check if the new block overlaps with existing blocks
        isValidPosition = this.existingPositions.every(position => {
            const { top: existingTop, left: existingLeft } = position;
            return (
                top + blockSize < existingTop ||
                left + blockSize < existingLeft ||
                top > existingTop + blockSize ||
                left > existingLeft + blockSize
            );
        });
    }

    // Add the new position to the list of existing positions
    this.existingPositions.push({ top, left });

    return {
        position: 'absolute',
        top: `${top}px`, // Adjusted to pixels for easier calculation
        left: `${left}px`, // Adjusted to pixels for easier calculation
        width: `${blockSize}px`,
        height: `${blockSize}px`
    };
  }

  getPosition = (top, left, blockSize) => {
    return {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${blockSize}px`,
        height: `${blockSize}px`
    };
  }

  restartGame = () => {
    clearInterval(this.timerID);
    this.setState({
      gameStarted: false,
      targetColor: '',
      playerName: '',
      gameOver: false,
      score: 0,
      timeLeft: 5 // 5秒倒數
    });
    this.existingPositions = [];
  }

  render() {
    const { gameStarted, targetColor, gameOver, score, timeLeft, playerName, leaderboard } = this.state;
    return (
      <div>
        {gameStarted === false && (
          <div className='start_end'>
            <input type="text" value={playerName} onChange={this.handleNameChange} placeholder="Enter your name" />
            <button onClick={this.startGame}>Start Game</button>
          </div>
        )}
        {gameStarted && gameOver === false && (
          <div>
            <h2>Time Left: {timeLeft}</h2>
            <h2>Score: {score}</h2>
            <h2>Target Color:</h2>
            <div style={{ backgroundColor: targetColor, width: '80px', height: '80px' }}></div>
            <div style={{ backgroundColor: targetColor, ...this.getRandomPosition() }} onClick={() => this.handleBlockClick(targetColor)}></div>
            <div style={{ backgroundColor: this.getRandomColor(), ...this.getRandomPosition() }} onClick={() => this.handleBlockClick()}></div>
            <div style={{ backgroundColor: this.getRandomColor(), ...this.getRandomPosition() }} onClick={() => this.handleBlockClick()}></div>
          </div>
        )}
        {gameOver && (
          <div className='start_end'>
            <h2 className='game-over-message'>Game Over!</h2>
            <div>Final Score for {playerName}: {score}</div>
            <button onClick={this.restartGame}>Restart Game</button>
            <h2>Leaderboard</h2>
            <ul>
              {leaderboard.map((entry, index) => (
                <li key={index}>{entry.playerName}: {entry.score}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
