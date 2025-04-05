
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Timer from '@/components/Timer';
import DifficultySelector from '@/components/DifficultySelector';
import HectocBoard from '@/components/HectocBoard';
import LevelProgress from '@/components/LevelProgress';
import Confetti from '@/components/Confetti';
import PointsAnimation from '@/components/PointsAnimation';
import { generatePuzzle, checkSolution } from '@/utils/puzzleGenerator';
import { Difficulty } from '@/utils/gameLogic';
import { RefreshCcw, Trophy, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const SinglePlayerSpeedMath: React.FC = () => {
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState<string>('');
  const [currentSolution, setCurrentSolution] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [clearBoardTrigger, setClearBoardTrigger] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    generateNewPuzzle();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimeout();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameActive]);

  const getTimeLimit = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'easy': return 90;
      case 'medium': return 60;
      case 'hard': return 45;
      case 'expert': return 30;
      default: return 60;
    }
  };

  const generateNewPuzzle = () => {
    const newPuzzle = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setCurrentSolution('');
    setClearBoardTrigger(prev => !prev); // Toggle to trigger board clear
    setTimeLeft(getTimeLimit(difficulty));
    setGameCompleted(false);
  };

  const startGame = () => {
    generateNewPuzzle();
    setGameActive(true);
  };

  const handleTimeout = () => {
    clearInterval(timerRef.current!);
    setGameActive(false);
    toast.error("Time's up! Try again.", {
      description: "You ran out of time. Let's try another puzzle!",
    });
    setStreakCount(0);
  };

  const handleAddDigit = (digit: string) => {
    setCurrentSolution(prev => prev + digit);
  };

  const handleAddOperator = (operator: string) => {
    setCurrentSolution(prev => prev + operator);
  };

  const handleRemoveLast = () => {
    setCurrentSolution(prev => prev.slice(0, -1));
  };

  const handleClearSolution = () => {
    setCurrentSolution('');
  };

  const handleCheckSolution = () => {
    const isCorrect = checkSolution(puzzle, currentSolution);
    
    if (isCorrect) {
      handleCorrectSolution();
    } else {
      toast.error("Not quite right", {
        description: "Your expression doesn't equal 100. Try again!",
      });
    }
  };

  const handleCorrectSolution = () => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculate points
    const newStreak = streakCount + 1;
    const timeBonus = Math.floor(timeLeft * 0.5);
    const difficultyMultiplier = 
      difficulty === 'easy' ? 1 :
      difficulty === 'medium' ? 1.5 :
      difficulty === 'hard' ? 2 : 3;
    
    const points = Math.floor((100 + timeBonus) * difficultyMultiplier);
    const streakBonus = newStreak >= 3 ? Math.floor(points * 0.2) : 0;
    const totalPoints = points + streakBonus;
    
    // Update state
    setStreakCount(newStreak);
    setScore(prev => prev + totalPoints);
    setPointsEarned(totalPoints);
    setShowPointsAnimation(true);
    setGameCompleted(true);
    
    // Level up if needed
    if (newStreak % 3 === 0) {
      setLevel(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    
    // Show toast
    toast.success("Correct solution!", {
      description: `You earned ${totalPoints} points${streakBonus > 0 ? ` (including a streak bonus of ${streakBonus})` : ''}!`,
    });
    
    // Reset animation states
    setTimeout(() => {
      setShowPointsAnimation(false);
    }, 2000);
  };

  const handleSelectDifficulty = (newDifficulty: Difficulty) => {
    if (gameActive) return;
    setDifficulty(newDifficulty);
    generateNewPuzzle();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Game Header */}
      <Card className="p-4 mb-4 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm border-2 border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <h2 className="font-gaming text-2xl mb-2">Speed Math Challenge</h2>
            <p className="text-muted-foreground text-sm">Create an expression that equals 100 using all numbers exactly once.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-primary/20 p-3 rounded-lg flex flex-col items-center">
              <span className="text-xs text-muted-foreground">SCORE</span>
              <span className="font-bold text-xl">{score}</span>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg flex flex-col items-center">
              <span className="text-xs text-muted-foreground">STREAK</span>
              <span className="font-bold text-xl">{streakCount}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Timer & Progress */}
        <div className="md:col-span-1 space-y-4">
          {/* Confetti Animation */}
          {showConfetti && <Confetti active={true} />}
          
          {/* Timer */}
          <Timer 
            timeLeft={timeLeft} 
            gameActive={gameActive} 
            maxTime={getTimeLimit(difficulty)} 
            className="mb-4" 
          />
          
          {/* Level Progress */}
          <LevelProgress level={level} difficulty={difficulty} />
          
          {/* Difficulty Selector */}
          <DifficultySelector 
            currentDifficulty={difficulty} 
            onSelectDifficulty={handleSelectDifficulty} 
            disabled={gameActive} 
          />
          
          {/* Game Controls */}
          <div className="flex gap-2 mt-4">
            {!gameActive ? (
              <Button 
                onClick={startGame} 
                className="w-full bg-game-primary hover:bg-game-primary/90"
              >
                Start Game
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setGameActive(false);
                  if (timerRef.current) clearInterval(timerRef.current);
                }} 
                variant="destructive"
                className="w-full"
              >
                Give Up
              </Button>
            )}
          </div>
        </div>
        
        {/* Right Column - Game Board */}
        <div className="md:col-span-2">
          {/* Points Animation */}
          {showPointsAnimation && <PointsAnimation points={pointsEarned} isActive={true} />}
          
          {/* Game Board */}
          <HectocBoard 
            puzzle={puzzle}
            currentSolution={currentSolution}
            onAddDigit={handleAddDigit}
            onAddOperator={handleAddOperator}
            onRemoveLast={handleRemoveLast}
            onClearSolution={handleClearSolution}
            onCheckSolution={handleCheckSolution}
            gameActive={gameActive}
            gameCompleted={gameCompleted}
          />
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerSpeedMath;
