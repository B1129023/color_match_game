// src/Othello.js
import React, { useState, useEffect } from 'react';
import './Othello.css';

const ROWS = 8;
const COLS = 8;
const SQ_SIZE = 65;
const WHITE = 1;
const BLACK = -1;
const VALID_MOVE_COLOR = 'rgb(0, 191, 255)';

const initializeBoard = () => {
  const board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  board[3][3] = board[4][4] = WHITE;
  board[3][4] = board[4][3] = BLACK;
  return board;
};

const isValidMove = (board, row, col, player) => {
  if (board[row][col] !== 0) return false;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];
  for (let [dr, dc] of directions) {
    let r = row + dr, c = col + dc, foundOpponent = false;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      if (board[r][c] === -player) {
        foundOpponent = true;
      } else if (foundOpponent && board[r][c] === player) {
        return true;
      } else {
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return false;
};

const hasValidMove = (board, player) => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (isValidMove(board, row, col, player)) {
        return true;
      }
    }
  }
  return false;
};

const makeMove = (board, row, col, player) => {
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];
  const newBoard = board.map(arr => arr.slice());
  newBoard[row][col] = player;
  for (let [dr, dc] of directions) {
    let r = row + dr, c = col + dc, flipPositions = [];
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === -player) {
      flipPositions.push([r, c]);
      r += dr;
      c += dc;
    }
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      for (let [fr, fc] of flipPositions) {
        newBoard[fr][fc] = player;
      }
    }
  }
  return newBoard;
};

const countPieces = (board) => {
  let whiteCount = 0, blackCount = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === WHITE) whiteCount++;
      if (board[row][col] === BLACK) blackCount++;
    }
  }
  return [whiteCount, blackCount];
};

// AI move (Greedy algorithm)
const aiMove = (board, player) => {
  let bestScore = -1;
  let bestMove = null;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (isValidMove(board, row, col, player)) {
        const tempBoard = makeMove(board, row, col, player);
        const [whiteCount, blackCount] = countPieces(tempBoard);
        const score = player === WHITE ? whiteCount : blackCount;
        if (score > bestScore) {
          bestScore = score;
          bestMove = [row, col];
        }
      }
    }
  }

  if (bestMove) {
    return makeMove(board, bestMove[0], bestMove[1], player);
  }
  return board;
};

const Othello = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [player, setPlayer] = useState(BLACK);
  const [validMoves, setValidMoves] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [piecesCount, setPiecesCount] = useState(countPieces(board));

  useEffect(() => {
    const moves = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (isValidMove(board, row, col, player)) {
          moves.push([row, col]);
        }
      }
    }
    setValidMoves(moves);
    setGameOver(!hasValidMove(board, WHITE) && !hasValidMove(board, BLACK));

    if (player === WHITE && moves.length > 0) {
      const newBoard = aiMove(board, WHITE);
      setBoard(newBoard);
      setPlayer(BLACK);
      setPiecesCount(countPieces(newBoard));
    }
  }, [board, player]);

  const handleClick = (row, col) => {
    if (player === BLACK && isValidMove(board, row, col, player)) {
      const newBoard = makeMove(board, row, col, player);
      setBoard(newBoard);
      setPlayer(WHITE);
      setPiecesCount(countPieces(newBoard));
    }
  };

  return (
    <div className="othello">
      <h1>黑白棋</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="cell"
                style={{
                  backgroundColor: validMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                    ? VALID_MOVE_COLOR
                    : 'green'
                }}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell === WHITE && <div className="piece white" />}
                {cell === BLACK && <div className="piece black" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="info">
        <h2>分數</h2>
        <div className="score">
          <div className="white-count">白棋: {piecesCount[0]}</div>
          <div className="black-count">黑棋: {piecesCount[1]}</div>
        </div>
        {gameOver && <h2>遊戲結束！</h2>}
      </div>
    </div>
  );
};

export default Othello;
