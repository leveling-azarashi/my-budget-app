
import React from 'react';
import { Position } from './SnakeGame';

interface FruitProps {
  position: Position;
  type: number;
}

const Fruit: React.FC<FruitProps> = ({ position, type }) => {
  const fruitVariants = [
    { emoji: '🍎', color: 'bg-red-500', glow: 'shadow-red-400' },
    { emoji: '🍊', color: 'bg-orange-500', glow: 'shadow-orange-400' },
    { emoji: '🍌', color: 'bg-yellow-500', glow: 'shadow-yellow-400' },
    { emoji: '🍇', color: 'bg-purple-500', glow: 'shadow-purple-400' },
    { emoji: '🥝', color: 'bg-green-500', glow: 'shadow-green-400' },
    { emoji: '🍓', color: 'bg-pink-500', glow: 'shadow-pink-400' },
  ];

  const currentFruit = fruitVariants[type % fruitVariants.length];

  return (
    <div
      className={`
        ${currentFruit.color} 
        ${currentFruit.glow}
        rounded-full 
        border-2 
        border-white 
        shadow-lg 
        shadow-lg
        animate-pulse
        hover:scale-110
        transition-transform
        duration-200
        flex
        items-center
        justify-center
        text-lg
        relative
        overflow-hidden
      `}
      style={{
        gridColumnStart: position.x + 1,
        gridRowStart: position.y + 1,
      }}
    >
      {/* Fruit emoji */}
      <span className="text-white drop-shadow-md font-bold relative z-10">
        {currentFruit.emoji}
      </span>
      
      {/* Sparkle effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
      
      {/* Rotating border effect */}
      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-spin"></div>
      
      {/* Pulsing glow */}
      <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
    </div>
  );
};

export default Fruit;
