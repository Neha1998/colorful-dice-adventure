import React, { useState, useEffect, useRef } from 'react';
import GameBoard from '@/components/GameBoard';
import DiceRoller from '@/components/DiceRoller';
import ScoreCard from '@/components/ScoreCard';
import { Player } from '@/components/ScoreCard';
import GameControls from '@/components/GameControls';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

const BOARD_SIZE = 5; // 5x5 board
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const WINNING_SCORE = 30; // Score needed to win

// Define initial players
const initialPlayers: Player[] = [
  { id: 1, name: 'Red Bird', color: 'red', score: 0, position: 0 },
  { id: 2, name: 'Blue Bird', color: 'blue', score: 0, position: 0 },
  { id: 3, name: 'Green Bird', color: 'green', score: 0, position: 0 },
  { id: 4, name: 'Yellow Bird', color: 'yellow', score: 0, position: 0 },
];

// Define the possible tile colors to match player colors
const tileColors = ['red', 'blue', 'green', 'yellow', 'purple'];

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [currentPlayerRolled, setCurrentPlayerRolled] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [movingPlayerId, setMovingPlayerId] = useState<number | null>(null);
  const [lastPosition, setLastPosition] = useState<number | null>(null);
  const [scoreAnimation, setScoreAnimation] = useState<number | null>(null);
  
  // Sound references
  const moveAudioRef = useRef<HTMLAudioElement | null>(null);
  const scoreAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Generate a random board pattern once at the beginning
  const [boardPattern] = useState<string[]>(() => {
    const pattern: string[] = [];
    for (let i = 0; i < TOTAL_TILES; i++) {
      const colorIndex = (Math.floor(i / 3) + i) % tileColors.length;
      pattern.push(tileColors[colorIndex]);
    }
    return pattern;
  });

  useEffect(() => {
    // Initialize audio elements
    moveAudioRef.current = new Audio('/move.mp3');
    scoreAudioRef.current = new Audio('/score.mp3');
    winAudioRef.current = new Audio('/win.mp3');
    
    // Clean up audio elements on unmount
    return () => {
      moveAudioRef.current = null;
      scoreAudioRef.current = null;
      winAudioRef.current = null;
    };
  }, []);

  // Handle dice roll
  const handleDiceRoll = (value: number) => {
    if (!gameStarted || winner) return;
    
    setCurrentRoll(value);
    setCurrentPlayerRolled(true);
    
    const currentPlayer = players.find(p => p.id === currentPlayerId);
    if (!currentPlayer) return;
    
    // Store the last position for animation
    setLastPosition(currentPlayer.position);
    setMovingPlayerId(currentPlayer.id);
    
    // Play move sound
    if (moveAudioRef.current) {
      moveAudioRef.current.currentTime = 0;
      moveAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Calculate the new position
    let newPosition = currentPlayer.position + value;
    
    // Check if player has reached the end of the board
    if (newPosition >= TOTAL_TILES) {
      newPosition = TOTAL_TILES - 1;
      toast(`${currentPlayer.name} reached the end of the board!`);
    }
    
    // Update player position with delay for animation
    setTimeout(() => {
      // Update player position
      const updatedPlayers = players.map(player => {
        if (player.id === currentPlayerId) {
          return { 
            ...player, 
            position: newPosition 
          };
        }
        return player;
      });
      
      setPlayers(updatedPlayers);
      
      // Check if the player landed on a tile that matches their color
      checkForPoints(updatedPlayers, newPosition);
      
      // Reset movement animation after a delay
      setTimeout(() => {
        setMovingPlayerId(null);
        setLastPosition(null);
      }, 500);
      
      // Auto-select next player after a delay
      setTimeout(() => {
        if (!winner) {
          nextPlayer();
        }
      }, 1500);
    }, 600);
  };
  
  // Check if the player has landed on a tile that matches their color
  const checkForPoints = (updatedPlayers: Player[], position: number) => {
    const currentPlayer = updatedPlayers.find(p => p.id === currentPlayerId);
    if (!currentPlayer) return;
    
    const tileColor = boardPattern[position];
    
    // If the tile color matches the player's color, add points
    if (tileColor === currentPlayer.color) {
      // Activate score animation
      setScoreAnimation(currentPlayer.id);
      
      // Play score sound
      if (scoreAudioRef.current) {
        scoreAudioRef.current.currentTime = 0;
        scoreAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      
      // Award 10 points for matching colors
      const finalPlayers = updatedPlayers.map(player => {
        if (player.id === currentPlayerId) {
          const newScore = player.score + 10;
          
          toast.success(`${player.name} gained 10 points! Total: ${newScore}`, {
            description: 'Color match bonus!',
          });
          
          // Check for winner
          if (newScore >= WINNING_SCORE) {
            setTimeout(() => {
              setWinner(player);
              
              // Play win sound
              if (winAudioRef.current) {
                winAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
              }
              
              toast.success(`🎉 ${player.name} wins the game! 🎉`, {
                description: `With a score of ${newScore} points!`,
                duration: 5000,
              });
            }, 1000);
          }
          
          return { ...player, score: newScore };
        }
        return player;
      });
      
      setPlayers(finalPlayers);
      
      // Reset score animation after a delay
      setTimeout(() => {
        setScoreAnimation(null);
      }, 1000);
    }
  };

  // Move to the next player's turn
  const nextPlayer = () => {
    if (!gameStarted || winner) return;
    
    // Find the next player in the rotation
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayerId = players[nextIndex].id;
    
    setCurrentPlayerId(nextPlayerId);
    setCurrentPlayerRolled(false);
    setCurrentRoll(null);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setWinner(null);
    toast.success('Game started! Roll the dice to begin.');
  };

  // Reset the game
  const resetGame = () => {
    setPlayers(initialPlayers);
    setCurrentPlayerId(1);
    setGameStarted(false);
    setCurrentRoll(null);
    setCurrentPlayerRolled(false);
    setWinner(null);
    setMovingPlayerId(null);
    setLastPosition(null);
    setScoreAnimation(null);
    toast.info('Game reset. Ready to start a new game!');
  };

  useEffect(() => {
    if (gameStarted) {
      const currentPlayer = players.find(p => p.id === currentPlayerId);
      if (currentPlayer) {
        toast(`${currentPlayer.name}'s turn!`);
      }
    }
  }, [currentPlayerId, gameStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Audio elements */}
      <audio id="move-sound" src="/move.mp3" preload="auto"></audio>
      <audio id="score-sound" src="/score.mp3" preload="auto"></audio>
      <audio id="win-sound" src="/win.mp3" preload="auto"></audio>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Colorful Birds Adventure
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Roll the dice, navigate the colorful board, and score points by landing on tiles 
            that match your bird's color!
          </p>
        </div>
        
        {/* Winner overlay */}
        {winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-2xl animate-pop-in max-w-lg w-full mx-4 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-player-red rounded-full opacity-10"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-player-blue rounded-full opacity-10"></div>
              
              <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
                <Sparkles className="text-amber-500 mr-2" />
                <span className={`text-player-${winner.color}`}>{winner.name} Wins!</span>
                <Sparkles className="text-amber-500 ml-2" />
              </h2>
              
              <div className="flex justify-center mb-6 animate-float">
                <div className="transform scale-150">
                  <PlayerAvatar 
                    color={winner.color} 
                    isActive={true}
                    size="md"
                    name=""
                  />
                </div>
              </div>
              
              <p className="text-center mb-6">
                Final Score: <span className="font-bold text-xl">{winner.score} points</span>
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all animate-appear"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <ScoreCard 
              players={players} 
              currentPlayerId={currentPlayerId} 
            />
            
            <GameControls 
              players={players}
              currentPlayerId={currentPlayerId}
              onNextPlayer={nextPlayer}
              gameStarted={gameStarted}
              onStartGame={startGame}
              onResetGame={resetGame}
              currentPlayerRolled={currentPlayerRolled}
            />
          </div>
          
          {/* Main game board */}
          <div className="lg:col-span-6 flex justify-center">
            <GameBoard 
              boardSize={BOARD_SIZE}
              players={players}
              currentPlayerId={currentPlayerId}
              movingPlayerId={movingPlayerId}
              lastPosition={lastPosition}
              scoreAnimation={scoreAnimation}
            />
          </div>
          
          {/* Right sidebar - Dice roller */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-5 w-full game-card border border-gray-100">
              <DiceRoller 
                onRoll={handleDiceRoll} 
                disabled={!gameStarted || currentPlayerRolled || winner !== null}
              />
              
              {currentRoll !== null && (
                <div className="mt-4 text-center animate-appear">
                  <p className="text-sm text-gray-500">Last roll</p>
                  <p className="text-2xl font-bold text-primary">{currentRoll}</p>
                </div>
              )}
              
              {gameStarted && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl shadow-inner">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Play</h3>
                  <ol className="text-xs text-gray-600 space-y-2 list-decimal pl-4">
                    <li>Roll the dice on your turn</li>
                    <li>Move your bird along the board</li>
                    <li>Score 10 points when landing on a tile matching your color</li>
                    <li>First to {WINNING_SCORE} points wins!</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
