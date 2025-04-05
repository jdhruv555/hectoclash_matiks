import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Obstacle {
  type: 'math' | 'jump';
  position: number;
  value?: number;
}

const generateMathProblem = () => {
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 0;
      num2 = 0;
      answer = 0;
  }

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer
  };
};

export default function GeoDash() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [currentProblem, setCurrentProblem] = useState<{ question: string; answer: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const gameLoop = useRef<number>();
  const playerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPlayerPosition(0);
    setGameOver(false);
    setObstacles([]);
    setCurrentProblem(null);
    
    // Generate initial obstacles
    const initialObstacles: Obstacle[] = [];
    for (let i = 0; i < 5; i++) {
      initialObstacles.push({
        type: Math.random() > 0.5 ? 'math' : 'jump',
        position: 100 + i * 200,
        value: Math.random() > 0.5 ? generateMathProblem().answer : undefined
      });
    }
    setObstacles(initialObstacles);

    // Start game loop
    gameLoop.current = window.setInterval(() => {
      setPlayerPosition(prev => {
        const newPosition = prev + 2;
        if (newPosition >= 1000) {
          setGameOver(true);
          return prev;
        }
        return newPosition;
      });

      // Check for collisions
      obstacles.forEach(obstacle => {
        if (Math.abs(playerPosition - obstacle.position) < 20) {
          if (obstacle.type === 'math') {
            setCurrentProblem(generateMathProblem());
          } else {
            // Jump obstacle
            setPlayerPosition(prev => prev + 50);
          }
        }
      });

      // Generate new obstacles
      if (playerPosition > obstacles[obstacles.length - 1].position - 500) {
        setObstacles(prev => [
          ...prev.slice(1),
          {
            type: Math.random() > 0.5 ? 'math' : 'jump',
            position: obstacles[obstacles.length - 1].position + 200,
            value: Math.random() > 0.5 ? generateMathProblem().answer : undefined
          }
        ]);
      }
    }, 50);
  };

  const handleAnswer = (answer: number) => {
    if (currentProblem && answer === currentProblem.answer) {
      setScore(prev => prev + 10);
      setCurrentProblem(null);
    } else {
      setGameOver(true);
    }
  };

  useEffect(() => {
    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>GeoDash: Math Rush</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">Score: {score}</p>
            </div>

            {!gameStarted ? (
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            ) : (
              <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                {/* Player */}
                <div
                  ref={playerRef}
                  className="absolute w-8 h-8 bg-blue-500 rounded-full"
                  style={{ left: `${playerPosition}px`, top: '160px' }}
                />

                {/* Obstacles */}
                {obstacles.map((obstacle, index) => (
                  <div
                    key={index}
                    className={`absolute w-8 h-8 ${
                      obstacle.type === 'math' ? 'bg-red-500' : 'bg-green-500'
                    } rounded-full`}
                    style={{ left: `${obstacle.position}px`, top: '160px' }}
                  />
                ))}

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-2 bg-gray-800" />
              </div>
            )}

            {currentProblem && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <p className="text-xl text-center">{currentProblem.question}</p>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <Button
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className="flex-1"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {gameOver && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-red-500">Game Over!</p>
                <p className="text-lg">Final Score: {score}</p>
                <Button onClick={startGame} className="mt-2">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 