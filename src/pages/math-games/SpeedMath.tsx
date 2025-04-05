import React, { useState, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import { useDebounce, useThrottle, useMemoizedValue } from '@/utils/performance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Timer } from '@/components/Timer';

const SpeedMath: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate answer without using eval
  const calculateAnswer = (problem: string): number => {
    if (!problem) return 0;
    const [num1Str, operator, num2Str] = problem.split(' ');
    const num1 = parseInt(num1Str);
    const num2 = parseInt(num2Str);
    
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      default: return 0;
    }
  };

  // Memoize the correct answer calculation
  const correctAnswer = useMemoizedValue(
    calculateAnswer(currentProblem),
    [currentProblem]
  );

  // Debounce the answer validation
  const validateAnswer = useDebounce((answer: string) => {
    if (answer === correctAnswer.toString()) {
      setScore(prev => prev + 1);
      generateNewProblem();
      setUserAnswer('');
    }
  }, 300);

  // Throttle the problem generation
  const generateNewProblem = useThrottle(() => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    setCurrentProblem(`${num1} ${operator} ${num2}`);
  }, 1000);

  // Handle user input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    validateAnswer(value);
  }, [validateAnswer]);

  // Handle game start
  const handleStartGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    generateNewProblem();
  }, [generateNewProblem]);

  // Handle game end
  const handleGameEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentProblem('');
    setUserAnswer('');
  }, []);

  return (
    <PageLayout
      title="Speed Math"
      subtitle="Solve math problems as quickly as you can!"
    >
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Score: {score}</div>
          {isPlaying && <Timer timeLeft={timeLeft} onTimeUp={handleGameEnd} maxTime={60} />}
        </div>

        <Card className="p-6">
          <div className="text-4xl font-bold text-center mb-4">
            {currentProblem || 'Press Start to begin!'}
          </div>
          <Input
            type="number"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter your answer"
            className="text-center text-2xl"
            disabled={!isPlaying}
          />
        </Card>

        <Progress value={(score / 10) * 100} className="h-2" />

        {!isPlaying && (
          <Button
            onClick={handleStartGame}
            className="w-full"
            size="lg"
          >
            Start Game
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default SpeedMath;
