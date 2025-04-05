import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api, GeometryDashProblem } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

interface GameState {
  playerPosition: number;
  obstacles: GeometryDashProblem[];
  currentProblem: { question: string; answer: number } | null;
  score: number;
  gameOver: boolean;
}

export default function GeoDash() {
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gameState = useRef<GameState>({
    playerPosition: 0,
    obstacles: [],
    currentProblem: null,
    score: 0,
    gameOver: false,
  });
  const animationFrameId = useRef<number>();
  const lastTime = useRef<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);

  const updateGame = useCallback((timestamp: number) => {
    if (!lastTime.current) lastTime.current = timestamp;
    const deltaTime = timestamp - lastTime.current;
    lastTime.current = timestamp;

    if (deltaTime > 16) { // Cap at ~60fps
      gameState.current.playerPosition += 2;
      
      // Check for collisions
      gameState.current.obstacles.forEach(obstacle => {
        if (Math.abs(gameState.current.playerPosition - obstacle.position) < 20) {
          if (obstacle.type === 'math') {
            gameState.current.currentProblem = {
              question: `${obstacle.value} + ? = ${(obstacle.value as number) + 5}`,
              answer: 5
            };
          } else {
            // Jump obstacle
            gameState.current.playerPosition += 50;
          }
        }
      });

      // Generate new obstacles
      if (gameState.current.playerPosition > gameState.current.obstacles[gameState.current.obstacles.length - 1].position - 500) {
        gameState.current.obstacles = [
          ...gameState.current.obstacles.slice(1),
          {
            type: Math.random() > 0.5 ? 'math' : 'jump',
            position: gameState.current.obstacles[gameState.current.obstacles.length - 1].position + 200,
            value: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : undefined
          }
        ];
      }

      // Check for game over
      if (gameState.current.playerPosition >= 1000) {
        gameState.current.gameOver = true;
        api.saveGeometryDashScore(gameState.current.score);
      }
    }

    if (!gameState.current.gameOver) {
      animationFrameId.current = requestAnimationFrame(updateGame);
    }
  }, []);

  const startGame = async () => {
    try {
      setLoading(true);
      const obstacles = await api.getGeometryDashProblems();
      gameState.current = {
        playerPosition: 0,
        obstacles,
        currentProblem: null,
        score: 0,
        gameOver: false,
      };
      setGameStarted(true);
      lastTime.current = 0;
      animationFrameId.current = requestAnimationFrame(updateGame);
    } catch (err) {
      setError('Failed to start game. Please try again later.');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: number) => {
    if (gameState.current.currentProblem && answer === gameState.current.currentProblem.answer) {
      gameState.current.score += 10;
      gameState.current.currentProblem = null;
    } else {
      gameState.current.gameOver = true;
      api.saveGeometryDashScore(gameState.current.score);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>GeoDash: Math Rush</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4 mx-auto" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>GeoDash: Math Rush</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>GeoDash: Math Rush</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">Score: {gameState.current.score}</p>
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
                  style={{ left: `${gameState.current.playerPosition}px`, top: '160px' }}
                />

                {/* Obstacles */}
                {gameState.current.obstacles.map((obstacle, index) => (
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

            {gameState.current.currentProblem && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <p className="text-xl text-center">{gameState.current.currentProblem.question}</p>
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

            {gameState.current.gameOver && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-red-500">Game Over!</p>
                <p className="text-lg">Final Score: {gameState.current.score}</p>
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
