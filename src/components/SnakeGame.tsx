
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import Snake from './Snake';
import Fruit from './Fruit';
import GameControls from './GameControls';

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type SnakeShape = 'straight' | 'wavy' | 'zigzag' | 'spiral';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [fruit, setFruit] = useState<Position>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snakeShape, setSnakeShape] = useState<SnakeShape>('straight');
  const [fruitType, setFruitType] = useState(0);
  const [speed, setSpeed] = useState(150);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const generateFruit = useCallback(() => {
    let newFruit: Position;
    do {
      newFruit = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFruit.x && segment.y === newFruit.y));
    
    setFruit(newFruit);
    setFruitType(prev => (prev + 1) % 6); // Cycle through 6 different fruit types
  }, [snake]);

  const checkCollision = useCallback((head: Position) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Apply shape-based movement modifications
      let moveX = 0, moveY = 0;
      
      switch (direction) {
        case 'UP': moveY = -1; break;
        case 'DOWN': moveY = 1; break;
        case 'LEFT': moveX = -1; break;
        case 'RIGHT': moveX = 1; break;
      }

      // Modify movement based on snake shape
      if (snakeShape === 'wavy') {
        const waveOffset = Math.sin(Date.now() / 200) * 0.3;
        if (direction === 'RIGHT' || direction === 'LEFT') {
          moveY += waveOffset;
        } else {
          moveX += waveOffset;
        }
      } else if (snakeShape === 'zigzag') {
        const zigzagOffset = Math.floor(Date.now() / 300) % 2 === 0 ? 0.2 : -0.2;
        if (direction === 'RIGHT' || direction === 'LEFT') {
          moveY += zigzagOffset;
        } else {
          moveX += zigzagOffset;
        }
      }

      head.x += Math.round(moveX);
      head.y += Math.round(moveY);

      if (checkCollision(head)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check if fruit is eaten
      if (head.x === fruit.x && head.y === fruit.y) {
        setScore(prev => prev + 10);
        generateFruit();
        setSpeed(prev => Math.max(80, prev - 2)); // Increase speed slightly
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, fruit, checkCollision, generateFruit, snakeShape]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setSpeed(150);
    setSnakeShape('straight');
    generateFruit();
  };

  const changeShape = () => {
    const shapes: SnakeShape[] = ['straight', 'wavy', 'zigzag', 'spiral'];
    const currentIndex = shapes.indexOf(snakeShape);
    const nextShape = shapes[(currentIndex + 1) % shapes.length];
    setSnakeShape(nextShape);
  };

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, gameOver, moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          changeShape();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, snakeShape]);

  // Initialize fruit on mount
  useEffect(() => {
    generateFruit();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-green-600 mb-2">🐍 Shape-Shifting Snake</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="text-sm text-gray-600">Shape: {snakeShape}</div>
            <div className="text-sm text-gray-600">Speed: {Math.round((200 - speed) / 2)}</div>
          </div>
        </div>

        <div className="relative">
          <div 
            className="grid bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-400 rounded-lg overflow-hidden shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              width: '600px',
              height: '600px',
            }}
          >
            <Snake snake={snake} shape={snakeShape} />
            <Fruit position={fruit} type={fruitType} />
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-center shadow-xl">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
                <p className="text-lg mb-4">Final Score: {score}</p>
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          {!isPlaying && !gameOver && (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )}
          
          {isPlaying && (
            <Button onClick={pauseGame} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}

          <Button onClick={changeShape} variant="outline" className="bg-blue-50 hover:bg-blue-100">
            <Zap className="w-4 h-4 mr-2" />
            Change Shape ({snakeShape})
          </Button>

          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <GameControls />
      </Card>
    </div>
  );
};

export default SnakeGame;
