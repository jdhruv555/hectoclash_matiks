
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Trophy, CheckCircle, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number; // in seconds
  problem: string;
  solution: string;
}

const DailyChallenges: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [userScore, setUserScore] = useState(0);
  
  // Sample daily challenges
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Arithmetic Sequence",
      description: "Find the next number in the sequence",
      difficulty: 'easy',
      points: 50,
      timeLimit: 60,
      problem: "What is the next number in the sequence: 3, 7, 11, 15, ...?",
      solution: "19"
    },
    {
      id: 2,
      title: "Algebra Challenge",
      description: "Solve for x in the given equation",
      difficulty: 'medium',
      points: 100,
      timeLimit: 90,
      problem: "Solve for x: 3x + 7 = 22",
      solution: "5"
    },
    {
      id: 3,
      title: "Fraction Operations",
      description: "Calculate the result of the fraction operation",
      difficulty: 'medium',
      points: 120,
      timeLimit: 120,
      problem: "Calculate: 2/3 + 1/6",
      solution: "5/6"
    },
    {
      id: 4,
      title: "Geometric Series",
      description: "Find the sum of the infinite geometric series",
      difficulty: 'hard',
      points: 200,
      timeLimit: 180,
      problem: "Find the sum of the infinite geometric series: 16 + 4 + 1 + 1/4 + ...",
      solution: "64/3"
    }
  ];
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      
      if (!submitted) {
        toast.error("Time's up! Challenge failed.");
        setSubmitted(true);
        setCorrect(false);
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, submitted]);
  
  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
    setUserAnswer("");
    setIsRunning(true);
    setSubmitted(false);
    setCorrect(false);
  };
  
  const submitAnswer = () => {
    if (!activeChallenge) return;
    
    setIsRunning(false);
    setSubmitted(true);
    
    // Normalize answers for comparison
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedSolution = activeChallenge.solution.trim().toLowerCase().replace(/\s+/g, '');
    
    const isCorrect = normalizedUserAnswer === normalizedSolution;
    setCorrect(isCorrect);
    
    if (isCorrect) {
      // Calculate time bonus (up to 50% of points for being fast)
      const timePercentage = timeLeft / activeChallenge.timeLimit;
      const timeBonus = Math.floor(activeChallenge.points * 0.5 * timePercentage);
      const totalPoints = activeChallenge.points + timeBonus;
      
      setUserScore(userScore + totalPoints);
      setCompletedChallenges([...completedChallenges, activeChallenge.id]);
      
      toast.success(`Challenge completed! +${totalPoints} points (includes ${timeBonus} time bonus)`);
    } else {
      toast.error("Incorrect answer. Try again!");
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <PageLayout 
      title="Daily Challenges" 
      subtitle="Test your skills with daily math challenges"
      showProgress
      progressValue={(completedChallenges.length / challenges.length) * 100}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold">Today's Challenges</h2>
          </div>
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
            <Trophy size={18} />
            Your Score: {userScore}
          </div>
        </div>
        
        {!activeChallenge ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map(challenge => {
              const isCompleted = completedChallenges.includes(challenge.id);
              
              return (
                <Card 
                  key={challenge.id} 
                  className={`p-5 border-l-4 ${
                    isCompleted 
                      ? 'border-l-green-500 bg-green-50' 
                      : challenge.difficulty === 'easy'
                      ? 'border-l-blue-500'
                      : challenge.difficulty === 'medium'
                      ? 'border-l-amber-500'
                      : 'border-l-red-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{challenge.title}</h3>
                        {isCompleted && <CheckCircle size={16} className="text-green-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      challenge.difficulty === 'easy'
                        ? 'bg-blue-100 text-blue-800'
                        : challenge.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {challenge.difficulty}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {formatTime(challenge.timeLimit)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy size={14} /> {challenge.points} points
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startChallenge(challenge)}
                    className={`w-full ${
                      isCompleted ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'Completed' : 'Start Challenge'}
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 bg-white">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{activeChallenge.title}</h2>
                <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                  activeChallenge.difficulty === 'easy'
                    ? 'bg-blue-100 text-blue-800'
                    : activeChallenge.difficulty === 'medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {activeChallenge.difficulty}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <Clock size={14} className={isRunning ? "animate-pulse text-red-500" : ""} /> 
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Trophy size={14} /> {activeChallenge.points} points
                </div>
                {isRunning && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Zap size={14} /> Time bonus active
                  </div>
                )}
              </div>
              
              <Progress 
                value={(timeLeft / activeChallenge.timeLimit) * 100}
                className={`h-2 ${timeLeft < activeChallenge.timeLimit * 0.3 ? 'bg-red-500' : ''}`}
              />
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
              <h3 className="font-medium mb-2">Problem:</h3>
              <p className="text-lg">{activeChallenge.problem}</p>
            </div>
            
            {!submitted ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium mb-1">
                    Your Answer:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="flex-1"
                      disabled={!isRunning}
                    />
                    <Button 
                      onClick={submitAnswer}
                      disabled={!isRunning || !userAnswer.trim()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setActiveChallenge(null)}
                  className="w-full"
                >
                  Cancel Challenge
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center gap-3 p-4 rounded ${
                  correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  <div>
                    <div className="font-medium">
                      {correct ? 'Correct Answer!' : 'Incorrect Answer'}
                    </div>
                    <div>
                      {correct 
                        ? `You completed the challenge with ${formatTime(timeLeft)} remaining.` 
                        : `The correct answer was: ${activeChallenge.solution}`}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setActiveChallenge(null)}
                  className="w-full"
                >
                  Back to Challenges
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default DailyChallenges;
