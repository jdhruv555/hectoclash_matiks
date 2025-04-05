import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Brain, Target, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { getAllProblems, getNextProblem, validateAnswer } from "@/utils/calculusProblems";
import type { Problem } from "@/utils/calculusProblems";

const CalculusQuest: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('calculusQuestHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    const problems = getAllProblems();
    setGameStarted(true);
    setCurrentProblem(problems[0]);
    setCurrentLevel(1);
    setScore(0);
    setLives(3);
    setStreakCount(0);
    toast.success("Welcome to Calculus Quest! Let's begin!");
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    const isCorrect = validateAnswer(userAnswer, currentProblem.answer);
    
    if (isCorrect) {
      const newScore = score + currentProblem.points + (streakCount * 10);
      setScore(newScore);
      setStreakCount(prev => prev + 1);
      
      if (streakCount > 0 && streakCount % 3 === 0) {
        toast.success("🔥 Hot streak! Bonus points awarded!");
      }
      
      const nextProblem = getNextProblem(currentProblem.id);
      if (nextProblem) {
        setCurrentProblem(nextProblem);
        setCurrentLevel(prev => prev + 1);
        toast.success("Correct! Moving to next level!");
      } else {
        toast.success("🎉 Congratulations! You've completed all levels!");
        endGame();
      }
    } else {
      setLives(prev => prev - 1);
      setStreakCount(0);
      toast.error("Not quite right. Try again!");
      if (lives <= 1) {
        endGame();
      }
    }
    setUserAnswer("");
    setShowHint(false);
  };

  const endGame = () => {
    setGameStarted(false);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('calculusQuestHighScore', score.toString());
      toast.success("🏆 New high score!");
    }
    
    toast.info(`Game Over! Final Score: ${score}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      checkAnswer();
    }
  };

  return (
    <PageLayout 
      title="Calculus Quest" 
      subtitle="Master calculus through an epic mathematical journey"
      showProgress
      progressValue={(currentLevel / getAllProblems().length) * 100}
    >
      <div className="max-w-4xl mx-auto p-6">
        {!gameStarted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8 bg-card/60 backdrop-blur-sm border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Calculus Quest</h2>
              
              {highScore > 0 && (
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-bold">High Score: {highScore}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold mb-2">Learn Calculus</h3>
                  <p className="text-sm text-muted-foreground">Master derivatives and integrals through interactive challenges</p>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold mb-2">Level Up</h3>
                  <p className="text-sm text-muted-foreground">Progress through increasingly challenging problems</p>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold mb-2">Earn Points</h3>
                  <p className="text-sm text-muted-foreground">Build streaks for bonus points and climb the leaderboard</p>
                </div>
              </div>
              
              <Button 
                onClick={startGame}
                className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
              >
                Start Your Journey
              </Button>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProblem?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-card/60 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">Level {currentLevel}</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-muted-foreground">Score: {score}</p>
                      {streakCount > 0 && (
                        <p className="text-primary">🔥 {streakCount} streak</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: lives }).map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-red-500" />
                    ))}
                  </div>
                </div>

                {currentProblem && (
                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 rounded-lg">
                      <p className="text-lg mb-2">{currentProblem.question}</p>
                      <p className="text-2xl font-mono text-primary">{currentProblem.expression}</p>
                    </div>

                    <div className="space-y-2">
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your answer..."
                        className="bg-muted/20 border-white/20"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowHint(!showHint)}
                          className="flex-1 border-white/20 hover:bg-white/5"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </Button>
                        
                        <Button
                          onClick={checkAnswer}
                          className="flex-1 bg-primary hover:bg-primary/90"
                          disabled={!userAnswer.trim()}
                        >
                          Check Answer
                        </Button>
                      </div>

                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                        >
                          <p className="text-sm text-primary">{currentProblem.hint}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageLayout>
  );
};

export default CalculusQuest;
