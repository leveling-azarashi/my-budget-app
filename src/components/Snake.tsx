
import React from 'react';
import { Position, SnakeShape } from './SnakeGame';

interface SnakeProps {
  snake: Position[];
  shape: SnakeShape;
}

const Snake: React.FC<SnakeProps> = ({ snake, shape }) => {
  const getSegmentStyle = (index: number, total: number) => {
    const isHead = index === 0;
    const isTail = index === total - 1;
    
    let baseClasses = "transition-all duration-150 ease-in-out relative";
    let backgroundColor = isHead ? 'bg-green-600' : `bg-green-${Math.max(300, 600 - index * 30)}`;
    
    // Add shape-specific styling
    switch (shape) {
      case 'wavy':
        baseClasses += " animate-pulse";
        backgroundColor = isHead ? 'bg-blue-600' : `bg-blue-${Math.max(300, 600 - index * 30)}`;
        break;
      case 'zigzag':
        baseClasses += " animate-bounce";
        backgroundColor = isHead ? 'bg-purple-600' : `bg-purple-${Math.max(300, 600 - index * 30)}`;
        break;
      case 'spiral':
        baseClasses += " animate-spin";
        backgroundColor = isHead ? 'bg-red-600' : `bg-red-${Math.max(300, 600 - index * 30)}`;
        break;
      default:
        backgroundColor = isHead ? 'bg-green-600' : `bg-green-${Math.max(300, 600 - index * 30)}`;
    }

    // Add special styling for head and tail
    if (isHead) {
      baseClasses += " border-2 border-white shadow-lg z-10";
    } else if (isTail) {
      baseClasses += " opacity-70";
    }

    return `${baseClasses} ${backgroundColor} rounded-lg border border-white/30`;
  };

  const getSegmentContent = (index: number) => {
    if (index === 0) {
      // Snake head with eyes
      return (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {snake.map((segment, index) => (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          className={getSegmentStyle(index, snake.length)}
          style={{
            gridColumnStart: segment.x + 1,
            gridRowStart: segment.y + 1,
            transform: shape === 'spiral' ? `rotate(${index * 15}deg)` : undefined,
          }}
        >
          {getSegmentContent(index)}
          
          {/* Add glow effect for special shapes */}
          {shape !== 'straight' && index === 0 && (
            <div className="absolute inset-0 rounded-lg opacity-50 animate-ping bg-current"></div>
          )}
        </div>
      ))}
    </>
  );
};

export default Snake;
