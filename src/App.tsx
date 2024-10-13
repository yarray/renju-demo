import React, { useState } from 'react';
import Board from './components/Board';
import { Circle } from 'lucide-react';

const App: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [winner, setWinner] = useState<'black' | 'white' | null>(null);

  const handleTurn = () => {
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  const handleWin = (player: 'black' | 'white') => {
    setWinner(player);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center font-serif">
      <h1 className="text-4xl mb-8 text-amber-900">Renju</h1>
      <div className="mb-4 flex items-center">
        <span className="mr-2">Current Player:</span>
        {currentPlayer === 'black' ? (
          <Circle className="w-6 h-6 text-black" fill="currentColor" />
        ) : (
          <Circle className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" />
        )}
      </div>
      <Board onTurn={handleTurn} onWin={handleWin} />
      <div className="mt-4 h-8 flex items-center justify-center">
        {winner && (
          <div className="text-xl text-amber-900">
            {winner.charAt(0).toUpperCase() + winner.slice(1)} wins!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;