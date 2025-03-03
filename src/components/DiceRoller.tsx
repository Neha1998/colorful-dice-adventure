
import React, { useState, useRef, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceRollerProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, disabled = false }) => {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const diceRef = useRef<HTMLDivElement>(null);

  const rollDice = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    
    // Play rolling animation for some time
    const audio = new Audio('/dice-roll.mp3');
    audio.volume = 0.5;
    audio.play();
    
    // Apply 3D rolling animation
    if (diceRef.current) {
      diceRef.current.style.animation = 'none';
      // Force reflow to restart animation
      void diceRef.current.offsetWidth;
      diceRef.current.style.animation = 'dice-3d-roll 0.6s ease-out';
    }
    
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
      onRoll(newValue);
    }, 600);
  };

  const renderDiceFace = () => {
    const diceProps = {
      size: 40,
      strokeWidth: 2,
      className: 'text-primary'
    };

    switch (diceValue) {
      case 1: return <Dice1 {...diceProps} />;
      case 2: return <Dice2 {...diceProps} />;
      case 3: return <Dice3 {...diceProps} />;
      case 4: return <Dice4 {...diceProps} />;
      case 5: return <Dice5 {...diceProps} />;
      case 6: return <Dice6 {...diceProps} />;
      default: return <Dice1 {...diceProps} />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium mb-2">Roll the dice</p>
      <div className="dice-container mb-4 perspective-500">
        <div 
          ref={diceRef}
          className={cn(
            "p-4 bg-white rounded-xl shadow-md dice flex items-center justify-center cursor-pointer border-2 dice-3d",
            isRolling ? "animate-dice-3d-roll" : "",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg border-primary/20 hover:rotate-y-12 hover:rotate-x-12 transition-transform duration-200",
          )}
          onClick={rollDice}
          role="button"
          aria-label="Roll dice"
          tabIndex={0}
        >
          {renderDiceFace()}
        </div>
      </div>
      <button
        onClick={rollDice}
        disabled={disabled || isRolling}
        className={cn(
          "px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 transition-all duration-300 animate-appear",
          disabled || isRolling 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-primary hover:bg-primary/90 focus:ring-primary/50"
        )}
      >
        {isRolling ? "Rolling..." : "Roll"}
      </button>
    </div>
  );
};

export default DiceRoller;
