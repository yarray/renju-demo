import React, { useState, useEffect } from 'react';
import { Circle, Undo2, RotateCcw } from 'lucide-react';

interface BoardProps {
  onTurn: () => void;
  onWin: (player: 'black' | 'white') => void;
}

interface Move {
  row: number;
  col: number;
  player: 'black' | 'white';
}

const Board: React.FC<BoardProps> = ({ onTurn, onWin }) => {
  const [board, setBoard] = useState<Array<Array<'black' | 'white' | null>>>(
    Array(15).fill(null).map(() => Array(15).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [winningStones, setWinningStones] = useState<Array<[number, number]>>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  const checkWin = (row: number, col: number, player: 'black' | 'white') => {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      const stones = [[row, col]];
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow < 0 ||
          newRow >= 15 ||
          newCol < 0 ||
          newCol >= 15 ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
        stones.push([newRow, newCol]);
      }
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow < 0 ||
          newRow >= 15 ||
          newCol < 0 ||
          newCol >= 15 ||
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
        stones.unshift([newRow, newCol]);
      }
      if (count >= 5) {
        setWinningStones(stones.slice(0, 5));
        return true;
      }
    }
    return false;
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === null && winningStones.length === 0) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setMoveHistory([...moveHistory, { row, col, player: currentPlayer }]);

      if (checkWin(row, col, currentPlayer)) {
        onWin(currentPlayer);
      } else {
        setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
        onTurn();
      }
    }
  };

  const handleUndo = () => {
    if (moveHistory.length > 0 && winningStones.length === 0) {
      const newMoveHistory = [...moveHistory];
      const lastMove = newMoveHistory.pop();
      if (lastMove) {
        const newBoard = [...board];
        newBoard[lastMove.row][lastMove.col] = null;
        setBoard(newBoard);
        setMoveHistory(newMoveHistory);
        setCurrentPlayer(lastMove.player);
        onTurn();
      }
    }
  };

  const handleReset = () => {
    setBoard(Array(15).fill(null).map(() => Array(15).fill(null)));
    setCurrentPlayer('black');
    setWinningStones([]);
    setMoveHistory([]);
    onTurn();
  };

  useEffect(() => {
    if (winningStones.length > 0) {
      const timer = setTimeout(() => {
        setWinningStones([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [winningStones]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#563232] p-4 rounded-lg shadow-lg">
        <div
          className="relative w-[450px] h-[450px]"
          style={{
            backgroundColor: '#e7cfb4',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Vertical lines */}
          {Array(15).fill(null).map((_, index) => (
            <div
              key={`v-${index}`}
              className="absolute top-0 bottom-0 w-[2px] bg-black opacity-50"
              style={{ left: `${(index / 14) * 100}%` }}
            ></div>
          ))}
          {/* Horizontal lines */}
          {Array(15).fill(null).map((_, index) => (
            <div
              key={`h-${index}`}
              className="absolute left-0 right-0 h-[2px] bg-black opacity-50"
              style={{ top: `${(index / 14) * 100}%` }}
            ></div>
          ))}
          {/* Center dot */}
          <div className="absolute w-[6px] h-[6px] bg-black opacity-50 rounded-full" style={{ top: '50%', left: '50%', marginLeft: '-2px', marginTop: '-2px' }}></div>
          {/* Stones */}
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                style={{
                  left: `calc(${(colIndex / 14) * 100}% - 15px)`,
                  top: `calc(${(rowIndex / 14) * 100}% - 15px)`,
                }}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell && (
                  <Circle
                    className={`w-[26px] h-[26px] ${
                      cell === 'black' ? 'text-black' : 'text-white'
                    } drop-shadow-md transition-transform duration-300 ${
                      winningStones.some(([r, c]) => r === rowIndex && c === colIndex)
                        ? 'animate-pulse scale-110'
                        : ''
                    }`}
                    fill="currentColor"
                  />
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors flex items-center"
            onClick={handleUndo}
            disabled={moveHistory.length === 0 || winningStones.length > 0}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </button>
          <button
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors flex items-center"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;