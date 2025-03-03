
import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

export interface Player {
  id: number;
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
  score: number;
  position: number;
}

interface ScoreCardProps {
  players: Player[];
  currentPlayerId: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ players, currentPlayerId }) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  const getPositionLabel = (index: number) => {
    switch (index) {
      case 0: return '1st';
      case 1: return '2nd';
      case 2: return '3rd';
      default: return `${index + 1}th`;
    }
  };

  const getPlayerBackgroundClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100';
      case 'blue': return 'bg-blue-100';
      case 'green': return 'bg-green-100';
      case 'yellow': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };
  
  const getPlayerTextClass = (color: string) => {
    switch (color) {
      case 'red': return 'text-player-red';
      case 'blue': return 'text-player-blue';
      case 'green': return 'text-player-green';
      case 'yellow': return 'text-player-yellow';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 game-card max-w-sm mx-auto w-full overflow-hidden border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Scoreboard</h2>
        <Trophy className="text-amber-500" size={22} />
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={cn(
              "py-3 flex items-center justify-between transition-all",
              player.id === currentPlayerId 
                ? 'bg-secondary/50 -mx-5 px-5 shadow-sm'
                : ''
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold",
                index === 0 ? 'bg-amber-100 text-amber-700' : 
                index === 1 ? 'bg-gray-100 text-gray-700' : 
                index === 2 ? 'bg-orange-100 text-orange-700' : 
                'bg-gray-50 text-gray-500'
              )}>
                {getPositionLabel(index)}
              </div>
              
              <span className={cn(
                "font-medium",
                getPlayerTextClass(player.color),
                player.id === currentPlayerId ? 'font-semibold' : ''
              )}>
                {player.name}
              </span>
            </div>
            
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              getPlayerBackgroundClass(player.color)
            )}>
              {player.score} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCard;
