
import React from 'react';
import { cn } from '@/lib/utils';
import { Player } from './ScoreCard';
import PlayerAvatar from './PlayerAvatar';

interface GameBoardProps {
  boardSize: number;
  players: Player[];
  currentPlayerId: number;
  onTileClick?: (position: number) => void;
}

// Define the possible tile colors
type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

const GameBoard: React.FC<GameBoardProps> = ({ 
  boardSize,
  players,
  currentPlayerId,
  onTileClick
}) => {
  // Create a board with a pattern of colors
  const generateColorPattern = (size: number): TileColor[] => {
    const colors: TileColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];
    
    // Create a board with size*size tiles
    const pattern: TileColor[] = [];
    
    for (let i = 0; i < size * size; i++) {
      // Create a pattern that repeats but has some variation
      const colorIndex = (Math.floor(i / 3) + i) % colors.length;
      pattern.push(colors[colorIndex]);
    }
    
    return pattern;
  };

  const colorPattern = generateColorPattern(boardSize);
  
  const getTileColorClass = (color: TileColor) => {
    switch (color) {
      case 'red': return 'bg-tile-red';
      case 'blue': return 'bg-tile-blue';
      case 'green': return 'bg-tile-green';
      case 'yellow': return 'bg-tile-yellow';
      case 'purple': return 'bg-tile-purple';
    }
  };
  
  const getBorderColorClass = (color: TileColor) => {
    switch (color) {
      case 'red': return 'border-player-red/30';
      case 'blue': return 'border-player-blue/30';
      case 'green': return 'border-player-green/30';
      case 'yellow': return 'border-player-yellow/30';
      case 'purple': return 'border-purple-400/30';
    }
  };

  // Render players on their positions
  const renderPlayerOnTile = (position: number) => {
    const playersOnTile = players.filter(player => player.position === position);
    
    if (playersOnTile.length === 0) return null;
    
    return (
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        playersOnTile.length > 1 ? "-space-x-2" : ""
      )}>
        {playersOnTile.map((player) => (
          <div key={player.id} className="transform translate-y-1 animate-appear">
            <PlayerAvatar 
              color={player.color} 
              isActive={player.id === currentPlayerId}
              size="sm"
              name=""
            />
          </div>
        ))}
      </div>
    );
  };

  // Create a spiral pattern for the board tiles
  const createSpiralBoard = () => {
    const totalTiles = boardSize * boardSize;
    const tiles = [];
    const boardArray = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    
    let counter = 0;
    let startRow = 0, endRow = boardSize - 1;
    let startCol = 0, endCol = boardSize - 1;
    
    while (startRow <= endRow && startCol <= endCol) {
      // Top row
      for (let i = startCol; i <= endCol; i++) {
        boardArray[startRow][i] = counter++;
      }
      startRow++;
      
      // Right column
      for (let i = startRow; i <= endRow; i++) {
        boardArray[i][endCol] = counter++;
      }
      endCol--;
      
      // Bottom row
      if (startRow <= endRow) {
        for (let i = endCol; i >= startCol; i--) {
          boardArray[endRow][i] = counter++;
        }
        endRow--;
      }
      
      // Left column
      if (startCol <= endCol) {
        for (let i = endRow; i >= startRow; i--) {
          boardArray[i][startCol] = counter++;
        }
        startCol++;
      }
    }
    
    // Now convert the 2D array to a renderable format
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const position = boardArray[row][col];
        const color = colorPattern[position];
        
        tiles.push(
          <div key={position} className="relative">
            <div
              className={cn(
                "game-tile w-16 h-16 md:w-20 md:h-20 rounded-lg m-1 flex items-center justify-center shadow-sm border-2",
                getTileColorClass(color),
                getBorderColorClass(color),
                "cursor-pointer hover:shadow-md"
              )}
              onClick={() => onTileClick?.(position)}
            >
              <span className="text-xs font-medium text-gray-600 opacity-70 z-10">{position + 1}</span>
              {renderPlayerOnTile(position)}
            </div>
          </div>
        );
      }
    }
    
    return (
      <div 
        style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        className="grid gap-0"
      >
        {tiles}
      </div>
    );
  };

  return (
    <div className="p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 animate-appear">
      {createSpiralBoard()}
    </div>
  );
};

export default GameBoard;
