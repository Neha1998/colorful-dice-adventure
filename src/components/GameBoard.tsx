
import React from 'react';
import { cn } from '@/lib/utils';
import { Player } from './ScoreCard';
import PlayerAvatar from './PlayerAvatar';
import { Crown } from 'lucide-react';

interface GameBoardProps {
  boardSize: number;
  players: Player[];
  currentPlayerId: number;
  onTileClick?: (position: number) => void;
  movingPlayerId?: number | null;
  lastPosition?: number | null;
  scoreAnimation?: number | null;
  winner?: Player | null;
  animatingPlayerId?: number | null;
  currentPath?: number[];
}

// Define the possible tile colors
type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

const GameBoard: React.FC<GameBoardProps> = ({ 
  boardSize,
  players,
  currentPlayerId,
  onTileClick,
  movingPlayerId = null,
  lastPosition = null,
  scoreAnimation = null,
  winner = null,
  animatingPlayerId = null,
  currentPath = []
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
        playersOnTile.length > 1 ? "flex-wrap gap-1" : ""
      )}>
        {playersOnTile.map((player, index) => {
          const isMoving = player.id === movingPlayerId;
          const isPreviousPosition = position === lastPosition && player.id === movingPlayerId;
          const playerScored = player.id === scoreAnimation;
          const isAnimating = player.id === animatingPlayerId && currentPath.includes(position);
          const isInPath = player.id === animatingPlayerId && currentPath.includes(position);
          const isPathEnd = player.id === animatingPlayerId && position === currentPath[currentPath.length - 1];
          
          // Calculate grid positions for multiple players
          // For 2 players: side by side
          // For 3-4 players: 2x2 grid
          let offsetX = 0;
          let offsetY = 0;
          
          if (playersOnTile.length === 2) {
            // Two players side by side
            offsetX = index === 0 ? -8 : 8;
          } else if (playersOnTile.length >= 3) {
            // Grid format (2x2)
            offsetX = index % 2 === 0 ? -8 : 8;
            offsetY = Math.floor(index / 2) === 0 ? -8 : 8;
          }
          
          return (
            <div 
              key={player.id} 
              className={cn(
                "transform transition-all duration-500 ease-bounce",
                isMoving ? "animate-hop z-20" : "",
                isPreviousPosition ? "animate-fade-out" : "",
                playerScored ? "animate-bounce-score z-30" : "",
                isPathEnd ? "animate-hop z-20" : "",
                isInPath && !isPathEnd ? "animate-pulse-scale" : "",
                playersOnTile.length > 1 ? "scale-90" : ""
              )}
              style={{ 
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                zIndex: isMoving || isAnimating ? 20 : 10,
                transitionDelay: isAnimating ? `${currentPath.indexOf(position) * 0.2}s` : '0s'
              }}
            >
              <PlayerAvatar 
                color={player.color} 
                isActive={player.id === currentPlayerId}
                size={playersOnTile.length > 2 ? "sm" : (playersOnTile.length > 1 ? "md" : "md")}
                name=""
              />
            </div>
          );
        })}
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
        const isScoreAnimationTile = players.some(p => p.id === scoreAnimation && p.position === position);
        const isWinningTile = winner && winner.position === position;
        const isPathTile = currentPath.includes(position);
        
        tiles.push(
          <div key={position} className="relative">
            <div
              className={cn(
                "game-tile w-16 h-16 md:w-20 md:h-20 rounded-lg m-1 flex items-center justify-center shadow-sm border-2 relative overflow-visible",
                getTileColorClass(color),
                getBorderColorClass(color),
                isScoreAnimationTile ? "animate-tile-pulse" : "",
                isPathTile ? "ring-2 ring-white ring-opacity-50" : "",
                isWinningTile ? "ring-4 ring-amber-500 shadow-lg" : "",
                "cursor-pointer hover:shadow-md transition-all"
              )}
              onClick={() => onTileClick?.(position)}
            >
              <span className="text-xs font-medium text-gray-600 opacity-70 z-10">{position + 1}</span>
              
              {/* Winner crown */}
              {isWinningTile && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 animate-float z-30">
                  <Crown className="h-6 w-6 text-amber-500 drop-shadow-md" />
                </div>
              )}
              
              {renderPlayerOnTile(position)}
              
              {/* Score animation overlay */}
              {isScoreAnimationTile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-lg font-bold text-white animate-score-float z-30">+10</div>
                </div>
              )}
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
