import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/lib/api';

interface GameState {
  numbers: number[];
  target: number;
  currentExpression: string;
  score: number;
  timeLeft: number;
  gameOver: boolean;
  level: number;
  streak: number;
  bestScore: number;
}

export default function HectoClash() {
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    numbers: [],
    target: 0,
    currentExpression: '',
    score: 0,
    timeLeft: 60,
    gameOver: false,
    level: 1,
    streak: 0,
    bestScore: 0,
  });

  const generateNumbers = (level: number) => {
    const count = Math.min(5 + level, 8);
    const numbers: number[] = [];
    const used = new Set<number>();

    while (numbers.length < count) {
      const num = Math.floor(Math.random() * 20) + 1;
      if (!used.has(num)) {
        numbers.push(num);
        used.add(num);
      }
    }

    // Generate a reachable target
    const target = numbers.reduce((acc, num) => acc + num, 0);
    return { numbers, target };
  };

  const startGame = async () => {
    try {
      setLoading(true);
      const { numbers, target } = generateNumbers(1);
      setGameState({
        numbers,
        target,
        currentExpression: '',
        score: 0,
        timeLeft: 60,
        gameOver: false,
        level: 1,
        streak: 0,
        bestScore: 0,
      });
      setGameStarted(true);
    } catch (err) {
      setError('Failed to start game. Please try again later.');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberClick = (num: number) => {
    if (gameState.gameOver) return;

    setGameState(prev => ({
      ...prev,
      currentExpression: prev.currentExpression + num.toString(),
    }));
  };

  const handleOperatorClick = (operator: string) => {
    if (gameState.gameOver) return;

    setGameState(prev => ({
      ...prev,
      currentExpression: prev.currentExpression + operator,
    }));
  };

  const calculateResult = () => {
    try {
      const result = eval(gameState.currentExpression);
      const isCorrect = Math.abs(result - gameState.target) < 0.0001;

      if (isCorrect) {
        const newScore = gameState.score + 10;
        const newStreak = gameState.streak + 1;
        const bonusPoints = newStreak % 3 === 0 ? 5 : 0;
        const totalScore = newScore + bonusPoints;

        setGameState(prev => ({
          ...prev,
          score: totalScore,
          streak: newStreak,
          bestScore: Math.max(prev.bestScore, totalScore),
          level: Math.floor(totalScore / 50) + 1,
        }));

        // Generate new numbers for next round
        const { numbers, target } = generateNumbers(gameState.level + 1);
        setGameState(prev => ({
          ...prev,
          numbers,
          target,
          currentExpression: '',
        }));

        // Save score if it's a new best
        if (totalScore > gameState.bestScore) {
          api.saveHectoClashScore(totalScore);
        }
      } else {
        setGameState(prev => ({
          ...prev,
          streak: 0,
          currentExpression: '',
        }));
      }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        currentExpression: '',
      }));
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameState.gameOver) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, gameOver: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameState.gameOver]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>HectoClash</CardTitle>
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
            <CardTitle>HectoClash</CardTitle>
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
          <CardTitle>HectoClash</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-sm text-blue-600">Score</p>
                <p className="text-xl font-bold">{gameState.score}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-sm text-green-600">Streak</p>
                <p className="text-xl font-bold">{gameState.streak}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-yellow-600">Level</p>
                <p className="text-xl font-bold">{gameState.level}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <p className="text-sm text-purple-600">Best</p>
                <p className="text-xl font-bold">{gameState.bestScore}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="relative">
              <Progress value={(gameState.timeLeft / 60) * 100} className="h-2" />
              <p className="text-center mt-2 font-semibold">{gameState.timeLeft}s</p>
            </div>

            {/* Target */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Target</p>
              <p className="text-3xl font-bold text-blue-600">{gameState.target}</p>
            </div>

            {/* Current Expression */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-mono">{gameState.currentExpression || '0'}</p>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-4 gap-2">
              {gameState.numbers.map((num, index) => (
                <Button
                  key={index}
                  onClick={() => handleNumberClick(num)}
                  className="h-16 text-xl font-bold bg-white hover:bg-blue-50 border-2"
                  disabled={gameState.gameOver}
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Operators */}
            <div className="grid grid-cols-4 gap-2">
              {['+', '-', '×', '÷'].map((op, index) => (
                <Button
                  key={index}
                  onClick={() => handleOperatorClick(op === '×' ? '*' : op === '÷' ? '/' : op)}
                  className="h-12 text-xl font-bold bg-gray-100 hover:bg-gray-200"
                  disabled={gameState.gameOver}
                >
                  {op}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={calculateResult}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={gameState.gameOver || !gameState.currentExpression}
              >
                Calculate
              </Button>
              <Button
                onClick={() => setGameState(prev => ({ ...prev, currentExpression: '' }))}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={gameState.gameOver || !gameState.currentExpression}
              >
                Clear
              </Button>
            </div>

            {/* Game Over Screen */}
            {gameState.gameOver && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Card className="w-96">
                  <CardHeader>
                    <CardTitle className="text-center">Game Over!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{gameState.score}</p>
                      <p className="text-gray-600">Final Score</p>
                    </div>
                    <Button onClick={startGame} className="w-full">
                      Play Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Start Game Button */}
            {!gameStarted && (
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 