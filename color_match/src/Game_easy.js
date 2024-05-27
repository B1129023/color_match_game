import React from 'react';
class Game_easy extends React.Component {
  render() {
    const {targetColor, timeLeft, score, handleBlockClick, getRandomPosition, getRandomColor, getPosition } = this.props;

    return (
      <div>
        <h2>Time Left: {timeLeft}</h2>
        <h2>Score: {score}</h2>
        <h2>targetColor : </h2>
        <div style={{ backgroundColor: 'black', ...getPosition(17, 362, 576) }}></div>
        <div style={{ backgroundColor: 'lightcyan', ...getPosition(20, 365, 570) }}></div>
        <div style={{ backgroundColor: targetColor, width: '80px', height: '80px' }}></div>
        <div style={{ backgroundColor: targetColor, ...getRandomPosition() }} onClick={() => handleBlockClick(targetColor)}></div>
        <div style={{ backgroundColor: getRandomColor(), ...getRandomPosition() }} onClick={() => handleBlockClick()}></div>
        <div style={{ backgroundColor: getRandomColor(), ...getRandomPosition() }} onClick={() => handleBlockClick()}></div>
      </div>
    );
  }
}

export default Game_easy;
