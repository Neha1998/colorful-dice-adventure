
import React from 'react';
import { Player } from './ScoreCard';
import PlayerAvatar from './PlayerAvatar';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface GameControlsProps {
  players: Player[];
  currentPlayerId: number;
  onNextPlayer: () => void;
  gameStarted: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
  currentPlayerRolled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  players,
  currentPlayerId,
  onNextPlayer,
  gameStarted,
  onStartGame,
  onResetGame,
  currentPlayerRolled
}) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center game-card border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Game Controls</h2>
      
      {!gameStarted ? (
        <div className="w-full flex flex-col space-y-3">
          <button
            onClick={onStartGame}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors animate-appear"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 mt-2 animate-slide-in">
            <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">Current Player</h3>
            <div className="flex justify-center">
              {currentPlayer && (
                <PlayerAvatar 
                  color={currentPlayer.color} 
                  isActive={true}
                  size="md"
                  name={currentPlayer.name}
                />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 w-full">
            <button
              onClick={onNextPlayer}
              disabled={!currentPlayerRolled}
              className={cn(
                "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-all duration-300",
                currentPlayerRolled 
                  ? "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 animate-appear"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
            >
              <span>Next Player</span>
              <ChevronRight size={16} />
            </button>
            
            <button
              onClick={onResetGame}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              Reset Game
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GameControls;
