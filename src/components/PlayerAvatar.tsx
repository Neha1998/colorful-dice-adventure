
import React from 'react';
import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  color: 'red' | 'blue' | 'green' | 'yellow';
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  name: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  color, 
  isActive = false, 
  size = 'md',
  name
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const colorClasses = {
    red: 'bg-player-red',
    blue: 'bg-player-blue',
    green: 'bg-player-green',
    yellow: 'bg-player-yellow'
  };

  const eyeSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const beakSize = {
    sm: 'border-t-[8px] border-l-[6px] border-r-[6px]',
    md: 'border-t-[12px] border-l-[8px] border-r-[8px]',
    lg: 'border-t-[16px] border-l-[12px] border-r-[12px]'
  };

  return (
    <div 
      className={cn(
        'relative rounded-full flex items-center justify-center overflow-visible player-avatar',
        colorClasses[color],
        sizeClasses[size],
        isActive ? 'animate-pulse-scale ring-4 ring-white ring-opacity-70' : '',
        isActive ? 'shadow-lg' : 'shadow-md'
      )}
    >
      {/* Eyes */}
      <div className="flex space-x-1">
        <div className={cn('bg-white rounded-full relative', eyeSize[size])}>
          <div className="absolute bg-black rounded-full w-1/2 h-1/2 top-1/4 right-1/4"></div>
        </div>
        <div className={cn('bg-white rounded-full relative', eyeSize[size])}>
          <div className="absolute bg-black rounded-full w-1/2 h-1/2 top-1/4 left-1/4"></div>
        </div>
      </div>
      
      {/* Beak */}
      <div 
        className={cn(
          'absolute border-t-amber-500 border-l-transparent border-r-transparent',
          beakSize[size],
          size === 'sm' ? 'top-5' : size === 'md' ? 'top-7' : 'top-10'
        )}
      ></div>
      
      {/* Eyebrows */}
      <div className="absolute flex space-x-3 top-1">
        <div className={cn(
          'bg-black h-0.5 rotate-12',
          size === 'sm' ? 'w-2' : size === 'md' ? 'w-3' : 'w-4'
        )}></div>
        <div className={cn(
          'bg-black h-0.5 -rotate-12',
          size === 'sm' ? 'w-2' : size === 'md' ? 'w-3' : 'w-4'
        )}></div>
      </div>
      
      {/* Player name label below avatar */}
      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

export default PlayerAvatar;
