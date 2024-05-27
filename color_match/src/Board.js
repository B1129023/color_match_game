// src/Board.js
import React, { useState } from 'react';
import './Board.css';

const initialBoard = [
  // initial positions of the shogi pieces
  // For simplicity, we use single characters to represent pieces
  ['l', 'n', 's', 'g', 'k', 'g', 's', 'n', 'l'],
  [' ', 'r', ' ', ' ', ' ', ' ', ' ', 'b', ' '],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  [' ', 'B', ' ', ' ', ' ', ' ', ' ', 'R', ' '],
  ['L', 'N', 'S', 'G', 'K', 'G', 'S', 'N', 'L']
];

const Board = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleCellClick = (row, col) => {
    if (selectedPiece) {
      const newBoard = board.map((r, rowIndex) => 
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) return selectedPiece.piece;
          if (rowIndex === selectedPiece.row && colIndex === selectedPiece.col) return ' ';
          return cell;
        })
      );
      setBoard(newBoard);
      setSelectedPiece(null);
    } else if (board[row][col] !== ' ') {
      setSelectedPiece({ piece: board[row][col], row, col });
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div 
              key={colIndex} 
              className={`cell ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
