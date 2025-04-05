
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/Timer";
import { toast } from "sonner";
import { MultiplayerProvider } from "@/contexts/MultiplayerContext";
import MultiplayerGameWrapper from "@/components/multiplayer/MultiplayerGameWrapper";

const MemoryGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    generateSequence(3); // Start with sequence of length 3
  };
  
  // Generate a new random sequence
  const generateSequence = (length: number) => {
    const newSequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentIndex(0);
    setShowingSequence(true);
    
    // Display sequence to user
    const displayInterval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < newSequence.length - 1) {
          return prev + 1;
        } else {
          clearInterval(displayInterval);
          setTimeout(() => {
            setShowingSequence(false);
            setCurrentIndex(-1);
          }, 800); // Show last number for 800ms
          return prev;
        }
      });
    }, 800); // Show each number for 800ms
  };
  
  // Handle user clicking a number
  const handleNumberClick = (num: number) => {
    if (showingSequence || gameOver) return;
    
    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);
    
    // Check if the input is correct so far
    if (num !== sequence[userSequence.length]) {
      // User made a mistake
      toast.error("Wrong sequence! Game over.");
      setGameOver(true);
      return;
    }
    
    // Check if user completed the sequence
    if (newUserSequence.length === sequence.length) {
      // Sequence correctly completed
      setScore(prev => prev + sequence.length);
      toast.success("Correct sequence!");
      
      // Increase level every 2 successful sequences
      if (score > 0 && score % 10 < sequence.length) {
        setLevel(prev => prev + 1);
        toast.info(`Level up! Now at level ${level + 1}`);
      }
      
      // Generate new, longer sequence
      const newLength = 3 + Math.floor(level / 2);
      setTimeout(() => generateSequence(newLength), 1000);
    }
  };
  
  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver || showingSequence) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          toast.info("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, showingSequence]);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!gameStarted || gameOver ? (
        <Card className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {gameOver ? "Game Over!" : "Mathematical Memory Challenge"}
          </h2>
          
          {gameOver && (
            <div className="mb-6 space-y-4">
              <p className="text-xl">
                Final Score: <span className="font-bold">{score}</span>
              </p>
              <p className="text-muted-foreground">
                Highest Level Reached: <span className="font-medium">{level}</span>
              </p>
              <Progress value={(level / 10) * 100} className="h-2 w-full max-w-md mx-auto" />
            </div>
          )}
          
          <p className="mb-6 text-muted-foreground">
            {gameOver 
              ? "Try again to beat your high score!" 
              : "Watch the sequence of numbers and repeat it back in the correct order."}
          </p>
          
          <Button 
            size="lg" 
            onClick={startGame}
            className="px-8"
          >
            {gameOver ? "Play Again" : "Start Game"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-muted/30 p-2 rounded-lg">
                <span className="text-muted-foreground mr-2">Level:</span>
                <span className="font-bold">{level}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded-lg">
                <span className="text-muted-foreground mr-2">Score:</span>
                <span className="font-bold">{score}</span>
              </div>
            </div>
            
            <Timer 
              timeLeft={timeLeft} 
              totalTime={60}
              className="w-24"
            />
          </div>
          
          <Card className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-center">
              {showingSequence 
                ? "Watch the sequence..." 
                : "Now repeat the sequence!"}
            </h3>
            
            {showingSequence && (
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-primary/80 rounded-lg flex items-center justify-center text-4xl font-bold animate-pulse">
                  {sequence[currentIndex]}
                </div>
              </div>
            )}
            
            {!showingSequence && (
              <div className="flex justify-center items-center gap-2 mb-4">
                {userSequence.map((num, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-lg font-bold"
                  >
                    {num}
                  </div>
                ))}
                {Array(sequence.length - userSequence.length).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 bg-black/20 border border-dashed border-primary/50 rounded-lg"
                  />
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <Button
                  key={num}
                  variant="outline"
                  className="aspect-square text-2xl font-bold p-8"
                  disabled={showingSequence}
                  onClick={() => handleNumberClick(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-muted-foreground">
              {showingSequence 
                ? "Memorize the sequence..." 
                : `Enter ${sequence.length} numbers in the correct order`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoryGames: React.FC = () => {
  return (
    <PageLayout
      title="MEMORY GAMES"
      subtitle="ENHANCE YOUR MATHEMATICAL MEMORY WITH CHALLENGING GAMES"
    >
      <MultiplayerProvider>
        <MultiplayerGameWrapper
          gameType="memory-game"
          singlePlayerComponent={<MemoryGame />}
          gameTitle="Memory Challenge"
          gameDescription="Test your memory against other players or watch live matches!"
        />
      </MultiplayerProvider>
    </PageLayout>
  );
};

export default MemoryGames;
