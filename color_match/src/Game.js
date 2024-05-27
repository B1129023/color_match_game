import React, { Component } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
// 分裝網頁顯示內容(新增內容)
import Game_start from './Game_start';
import Game_end from './Game_end';
import Game_easy from './Game_easy';
import Game_normal from './Game_normal';
import Game_hard from './Game_hard';

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
      leaderboardEasy: [],
      leaderboardNormal: [],
      leaderboardHard: [], 
      difficulty: 'easy' // 添加難度狀態(新增內容)
    };
    this.existingPositions = [];
  }

  // 在應用程序啟動時，呼叫resetScores()(新增內容)
  componentDidMount() { 
    if (process.env.NODE_ENV === 'development') {
      this.resetScores();
    }
  }
  // 重置排行榜數據(新增內容)
  resetScores = async () => {
    const allScoresSnapshot = await getDocs(collection(db, 'gameScores'));
    allScoresSnapshot.forEach(async (scoreDoc) => {
      await deleteDoc(doc(db, 'gameScores', scoreDoc.id));
    });
    this.setState({
      leaderboardEasy: [],
      leaderboardNormal: [],
      leaderboardHard: []
    });
  }

  // 保存分數(調整後)
  saveScore = async () => {
    const { playerName, score, difficulty } = this.state;
    try {
      await addDoc(collection(db, 'gameScores'), { playerName, score, difficulty });
      this.updateLeaderboard(difficulty);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
  
  // 更新排行榜(調整後)
  updateLeaderboard = async (difficulty) => {
    const scoresQuery = query(collection(db, 'gameScores'), orderBy('score', 'desc'));
    const querySnapshot = await getDocs(scoresQuery);
    const allScores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const filteredScores = allScores.filter(score => score.difficulty === difficulty);
    const topScores = filteredScores.sort((a, b) => b.score - a.score).slice(0, 5);
  
    if (difficulty === 'easy') {
      this.setState({ leaderboardEasy: topScores });
    } else if (difficulty === 'normal') {
      this.setState({ leaderboardNormal: topScores });
    } else if (difficulty === 'hard') {
      this.setState({ leaderboardHard: topScores });
    }
  
    if (allScores.length > 5) {
      const scoresToDelete = allScores.filter(score => !topScores.includes(score));
      scoresToDelete.forEach(async (scoreDoc) => {
        await deleteDoc(doc(db, 'gameScores', scoreDoc.id));
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

  selectDifficulty = (difficulty) => {
     this.setState({ difficulty })
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
      timeLeft: 5, // 重新設置倒數時間
    });
  }

  endGame = () => {
    this.setState({ gameOver: true });
    clearInterval(this.timerID);
    this.saveScore();
  }

  restartGame = () => {
    clearInterval(this.timerID);
    this.setState({
      gameStarted: false,
      targetColor: '',
      playerName: '', 
      gameOver: false,
      score: 0,
      timeLeft: 5, // 5秒倒數
      difficulty: 'easy' // 重新設置難度
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
    
    let top, left;
    let isValidPosition = false;

    while (!isValidPosition) {
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
    }

    this.existingPositions.push({ top, left });

    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
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
      // 直接呼叫endGame()結束遊戲，避免時間倒數到0時再次呼叫endGame()，造成分數重複計算(調整後)
      this.endGame();
    }
  }

  render() {
    
    const { gameStarted, targetColor, gameOver, score, timeLeft, playerName, difficulty, leaderboardEasy, leaderboardNormal, leaderboardHard } = this.state;
    
    // 根據難度選擇不同的遊戲組件(新增內容)
    let leaderboard;
    let gameComponent;
    if (gameStarted && !gameOver) {
      if(this.state.difficulty === 'easy') {
        gameComponent = (
          <Game_easy
          gameStarted={gameStarted}
          gameOver={gameOver}
          targetColor={targetColor}
          timeLeft={timeLeft}
          score={score}
          handleBlockClick={this.handleBlockClick}
          getRandomPosition={this.getRandomPosition}
          getRandomColor={this.getRandomColor}
          getPosition={this.getPosition}
          />
        );
      }else if(this.state.difficulty === 'normal') {
          gameComponent = (
            <Game_normal
            gameStarted={gameStarted}
            gameOver={gameOver}
            targetColor={targetColor}
            timeLeft={timeLeft}
            score={score}
            handleBlockClick={this.handleBlockClick}
            getRandomPosition={this.getRandomPosition}
            getRandomColor={this.getRandomColor}
            getPosition={this.getPosition}
            />
          );
      }else if(this.state.difficulty === 'hard') {
          gameComponent = (
            <Game_hard
            gameStarted={gameStarted}
            gameOver={gameOver}
            targetColor={targetColor}
            timeLeft={timeLeft}
            score={score}
            handleBlockClick={this.handleBlockClick}
            getRandomPosition={this.getRandomPosition}
            getRandomColor={this.getRandomColor}
            getPosition={this.getPosition}
            />
          );
      }
    }

    // 根據難度選擇不同的排行榜(新增內容)
    if (difficulty === 'easy') {
      leaderboard = leaderboardEasy;
    } else if (difficulty === 'normal') {
      leaderboard = leaderboardNormal;
    } else if (difficulty === 'hard') {
      leaderboard = leaderboardHard;
    }



    return (
      // 分裝網頁顯示內容(新增內容)
      <div>
        {/*開始頁面(調整後)*/}
        {gameStarted === false && (
          <Game_start 
          playerName={playerName} 
          handleNameChange={this.handleNameChange} 
          startGame={this.startGame}
          selectDifficulty={this.selectDifficulty} 
          difficulty={difficulty}
          />
        )}

        {/*遊戲介面(新增內容)*/}
        {gameComponent}
        
        {/*結束頁面(調整後)*/}
        {gameOver && (
          <Game_end
          playerName={playerName}
          score={score}
          restartGame={this.restartGame}
          leaderboardEasy={leaderboardEasy}
          leaderboardNormal={leaderboardNormal}
          leaderboardHard={leaderboardHard}
        />
        )}
      </div>
    );
  }
}

export default Game;
