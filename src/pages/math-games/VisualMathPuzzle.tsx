
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Brain, 
  Image, 
  Eye, 
  Lightbulb, 
  ChevronRight,
  RefreshCw,
  Trophy,
  CheckCircle,
  HelpCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import PointsAnimation from "@/components/PointsAnimation";

interface Puzzle {
  id: number;
  title: string;
  description: string;
  hint: string;
  image: string; // Updated to use actual image paths
  solution: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Pattern" | "Geometry" | "Logic" | "Algebra";
}

const VisualMathPuzzle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("patterns");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("easy");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  
  // Pattern Recognition Puzzles with real images
  const patternPuzzles: Puzzle[] = [
    {
      id: 1,
      title: "Find the Next Number",
      description: "Look at the sequence and determine what the next number should be: 2, 6, 12, 20, 30, ?",
      hint: "Think about the difference between consecutive numbers and how that difference changes.",
      image: "/lovable-uploads/45ca8243-3680-4892-8b71-b907d34dcec5.png",
      solution: "42",
      difficulty: "Easy",
      category: "Pattern"
    },
    {
      id: 2,
      title: "Fibonacci Pattern",
      description: "Find the next number in this famous sequence: 1, 1, 2, 3, 5, 8, ?",
      hint: "Each number is the sum of the two previous numbers.",
      image: "/lovable-uploads/961e3696-d571-4afe-9142-d6e3634a4ad3.png",
      solution: "13",
      difficulty: "Medium",
      category: "Pattern"
    },
    {
      id: 3,
      title: "Square Numbers",
      description: "Complete the pattern: 1, 4, 9, 16, 25, ?",
      hint: "These are square numbers. Think about what's being squared to get each number.",
      image: "/assets/puzzles/square-numbers.png",
      solution: "36",
      difficulty: "Easy",
      category: "Pattern"
    },
    {
      id: 4,
      title: "Complex Sequence",
      description: "What comes next in this sequence? 1, 3, 7, 15, 31, ?",
      hint: "Each number is double the previous number plus 1.",
      image: "/assets/puzzles/complex-sequence.png",
      solution: "63",
      difficulty: "Hard",
      category: "Pattern"
    }
  ];
  
  // Geometry Visual Puzzles
  const geometryPuzzles: Puzzle[] = [
    {
      id: 1,
      title: "Count the Triangles",
      description: "How many triangles can you find in this figure?",
      hint: "Look for triangles of different sizes and orientations. Some triangles might contain smaller triangles.",
      image: "/assets/puzzles/triangles-counting.png",
      solution: "16",
      difficulty: "Medium",
      category: "Geometry"
    },
    {
      id: 2,
      title: "Missing Angle",
      description: "Find the measure of the missing angle X in this polygon.",
      hint: "Remember that the sum of interior angles in a polygon with n sides is (n-2) × 180°.",
      image: "/assets/puzzles/missing-angle.png",
      solution: "45",
      difficulty: "Medium",
      category: "Geometry"
    },
    {
      id: 3,
      title: "Overlapping Shapes",
      description: "What is the area of the overlapping region between these two shapes?",
      hint: "Think about how to calculate the areas of each shape, and then find what's common between them.",
      image: "/assets/puzzles/overlapping-shapes.png",
      solution: "12",
      difficulty: "Hard",
      category: "Geometry"
    },
    {
      id: 4,
      title: "Path Through Shapes",
      description: "Find the shortest path from point A to point B traversing each shape exactly once.",
      hint: "Consider the geometric properties of each shape to find the optimal route.",
      image: "/assets/puzzles/path-through-shapes.png",
      solution: "ADBEC",
      difficulty: "Hard",
      category: "Geometry"
    }
  ];
  
  // Logic Visual Puzzles
  const logicPuzzles: Puzzle[] = [
    {
      id: 1,
      title: "Balance the Equation",
      description: "Rearrange the matchsticks to make this equation correct: 5 + 2 = 3",
      hint: "You can move only one matchstick. Think about changing one of the numbers or the operation.",
      image: "/assets/puzzles/matchstick-equation.png",
      solution: "5 - 2 = 3",
      difficulty: "Easy",
      category: "Logic"
    },
    {
      id: 2,
      title: "Knight's Tour",
      description: "Find a path for the knight to visit each square exactly once on this 5×5 board.",
      hint: "Start by considering squares with fewer possible moves, like corners.",
      image: "/assets/puzzles/knights-tour.png",
      solution: "A1B3C5E4D2A3B5C3D5E3D1B2C4E5",
      difficulty: "Hard",
      category: "Logic"
    },
    {
      id: 3,
      title: "Water Jug Problem",
      description: "Using a 3-gallon jug and a 5-gallon jug, how can you measure exactly 4 gallons?",
      hint: "Fill the 5-gallon jug completely, then transfer water to the 3-gallon jug.",
      image: "/assets/puzzles/water-jug.png",
      solution: "4",
      difficulty: "Medium",
      category: "Logic"
    },
    {
      id: 4,
      title: "Color Logic",
      description: "According to the pattern, what color should replace the question mark?",
      hint: "Look at how the colors change in each row and column.",
      image: "/assets/puzzles/color-logic.png",
      solution: "Blue",
      difficulty: "Medium",
      category: "Logic"
    }
  ];
  
  // Function to get puzzles based on active tab and difficulty
  const getFilteredPuzzles = () => {
    let puzzles: Puzzle[] = [];
    
    // Select puzzles based on active tab
    if (activeTab === "patterns") {
      puzzles = patternPuzzles;
    } else if (activeTab === "geometry") {
      puzzles = geometryPuzzles;
    } else if (activeTab === "logic") {
      puzzles = logicPuzzles;
    }
    
    // Filter by difficulty
    return puzzles.filter(puzzle => {
      if (activeDifficulty === "easy") return puzzle.difficulty === "Easy";
      if (activeDifficulty === "medium") return puzzle.difficulty === "Medium";
      if (activeDifficulty === "hard") return puzzle.difficulty === "Hard";
      return true; // If "all" is selected
    });
  };
  
  const filteredPuzzles = getFilteredPuzzles();
  const currentPuzzle = filteredPuzzles[currentPuzzleIndex];
  
  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < filteredPuzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      setCurrentPuzzleIndex(0); // Loop back to first puzzle
    }
    resetPuzzleState();
  };
  
  const resetPuzzleState = () => {
    setUserAnswer("");
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowConfetti(false);
    setShowPointsAnimation(false);
  };
  
  const handleShowHint = () => {
    setShowHint(true);
    toast.info("Hint revealed! Try to solve it now.");
  };
  
  const handleSubmitAnswer = () => {
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentPuzzle.solution.toLowerCase();
    setHasSubmitted(true);
    setIsCorrect(isAnswerCorrect);
    setTotalAttempted(totalAttempted + 1);
    
    if (isAnswerCorrect) {
      const pointsGained = currentPuzzle.difficulty === "Easy" ? 10 : 
                           currentPuzzle.difficulty === "Medium" ? 20 : 30;
      setScore(score + pointsGained);
      setPointsEarned(pointsGained);
      setShowConfetti(true);
      setShowPointsAnimation(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setShowPointsAnimation(false);
      }, 3000);
      
      toast.success("Correct answer! Well done!");
    } else {
      toast.error("Incorrect. Try again or check the solution.");
    }
  };
  
  const handleSkipPuzzle = () => {
    toast.info("Puzzle skipped. Moving to the next one.");
    handleNextPuzzle();
  };
  
  return (
    <PageLayout
      title="Visual Math Puzzles"
      subtitle="Enhance your mathematical thinking through visual challenges and puzzles"
      showProgress
      progressValue={(score / Math.max(1, totalAttempted)) * 100}
    >
      <Confetti active={showConfetti} duration={3000} pieces={150} />
      <PointsAnimation points={pointsEarned} isActive={showPointsAnimation} onComplete={() => setShowPointsAnimation(false)} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setCurrentPuzzleIndex(0);
            resetPuzzleState();
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Brain size={18} />
              Pattern Recognition
            </TabsTrigger>
            <TabsTrigger value="geometry" className="flex items-center gap-2">
              <Image size={18} />
              Geometric Puzzles
            </TabsTrigger>
            <TabsTrigger value="logic" className="flex items-center gap-2">
              <Eye size={18} />
              Visual Logic
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mb-4">
            <div className="space-x-2">
              <Button 
                variant={activeDifficulty === "easy" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveDifficulty("easy");
                  setCurrentPuzzleIndex(0);
                  resetPuzzleState();
                }}
                className={activeDifficulty === "easy" ? "bg-green-600" : "border-white/10"}
              >
                Easy
              </Button>
              <Button 
                variant={activeDifficulty === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveDifficulty("medium");
                  setCurrentPuzzleIndex(0);
                  resetPuzzleState();
                }}
                className={activeDifficulty === "medium" ? "bg-yellow-600" : "border-white/10"}
              >
                Medium
              </Button>
              <Button 
                variant={activeDifficulty === "hard" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveDifficulty("hard");
                  setCurrentPuzzleIndex(0);
                  resetPuzzleState();
                }}
                className={activeDifficulty === "hard" ? "bg-red-600" : "border-white/10"}
              >
                Hard
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy size={16} className="text-yellow-500" />
              <span>Score: {score}/{totalAttempted}</span>
            </div>
          </div>
          
          {filteredPuzzles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden bg-card border-white/10">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-primary">{currentPuzzle.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {currentPuzzle.category} • {currentPuzzle.difficulty}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSkipPuzzle}
                      className="border-white/10 hover:bg-primary/20"
                    >
                      Skip
                    </Button>
                  </div>
                  
                  <p className="mb-6">{currentPuzzle.description}</p>
                  
                  <motion.div 
                    className="bg-muted/30 rounded-lg mb-6 p-8 flex items-center justify-center"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 bg-muted/50 rounded-md text-center w-full max-w-lg">
                      {currentPuzzle.image.startsWith("/lovable-uploads") || currentPuzzle.image.startsWith("/assets") ? (
                        <img 
                          src={currentPuzzle.image} 
                          alt={currentPuzzle.title} 
                          className="w-full h-auto rounded-md shadow-lg mx-auto"
                          onError={(e) => {
                            // Fallback if image doesn't load
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="p-12 bg-black/30 rounded-md flex items-center justify-center">
                          <p className="text-lg text-muted-foreground">[Visualization for {currentPuzzle.title}]</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  {showHint && (
                    <motion.div 
                      className="bg-yellow-900/20 border border-yellow-700/30 rounded-md p-4 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb size={18} className="text-yellow-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-yellow-400 mb-1">Hint:</h3>
                          <p className="text-sm">{currentPuzzle.hint}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="space-y-4 mb-6">
                    <label htmlFor="answer" className="block text-sm font-medium">
                      Your Answer:
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="answer"
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="flex-1 px-4 py-2 bg-muted/30 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your answer here"
                        disabled={hasSubmitted && isCorrect}
                      />
                      <Button 
                        onClick={handleSubmitAnswer}
                        disabled={userAnswer.trim() === "" || (hasSubmitted && isCorrect)}
                        className="bg-primary hover:bg-primary/90 hover-scale"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                  
                  {hasSubmitted && (
                    <motion.div 
                      className={`rounded-md p-4 mb-6 ${isCorrect ? "bg-green-900/20 border border-green-700/30" : "bg-red-900/20 border border-red-700/30"}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle size={18} className="text-green-500 mt-0.5" />
                        ) : (
                          <XCircle size={18} className="text-red-500 mt-0.5" />
                        )}
                        <div>
                          <h3 className={`font-medium mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "Correct!" : "Incorrect!"}
                          </h3>
                          <p className="text-sm">
                            {isCorrect 
                              ? "Great job! You solved this puzzle correctly."
                              : `The correct answer is: ${currentPuzzle.solution}`
                            }
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between">
                    {!showHint && !hasSubmitted && (
                      <Button 
                        variant="outline" 
                        onClick={handleShowHint}
                        className="border-white/10 hover:bg-primary/20 flex items-center gap-2 hover-scale"
                      >
                        <HelpCircle size={16} />
                        Show Hint
                      </Button>
                    )}
                    
                    {(showHint || hasSubmitted) && !isCorrect && (
                      <Button 
                        variant="outline" 
                        onClick={resetPuzzleState}
                        className="border-white/10 hover:bg-primary/20 flex items-center gap-2 hover-scale"
                      >
                        <RefreshCw size={16} />
                        Reset
                      </Button>
                    )}
                    
                    {(hasSubmitted && isCorrect) && (
                      <Button 
                        onClick={handleNextPuzzle}
                        className="ml-auto bg-primary hover:bg-primary/90 flex items-center gap-2 hover-scale"
                      >
                        Next Puzzle
                        <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Puzzle {currentPuzzleIndex + 1} of {filteredPuzzles.length}</span>
                    <span>{currentPuzzle.category} • {currentPuzzle.difficulty}</span>
                  </div>
                  <Progress 
                    value={((currentPuzzleIndex + 1) / filteredPuzzles.length) * 100} 
                    className="h-1"
                  />
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="p-6 bg-card border-white/10">
              <div className="text-center py-12">
                <p className="text-lg mb-4">No puzzles available for the selected difficulty level.</p>
                <Button 
                  onClick={() => setActiveDifficulty("all")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Show All Puzzles
                </Button>
              </div>
            </Card>
          )}
          
          <Card className="p-6 mt-6 bg-gradient-to-r from-red-900/20 to-black border-white/10 hover-scale">
            <h3 className="text-lg font-bold mb-4">Benefits of Visual Math Puzzles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Brain size={16} />
                  Pattern Recognition
                </h4>
                <p className="text-sm">Enhances your ability to identify numerical patterns and sequences, which is crucial for algebraic thinking and problem-solving.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Image size={16} />
                  Spatial Reasoning
                </h4>
                <p className="text-sm">Develops your spatial intelligence and ability to manipulate shapes and objects mentally, essential skills for geometry and engineering.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Eye size={16} />
                  Visual Analysis
                </h4>
                <p className="text-sm">Improves your ability to extract mathematical information from visual representations, a skill that translates to interpreting graphs and diagrams.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-primary flex items-center gap-2">
                  <Lightbulb size={16} />
                  Creative Problem-Solving
                </h4>
                <p className="text-sm">Encourages thinking outside the box and approaching problems from multiple angles, fostering innovation and creative solutions.</p>
              </div>
            </div>
          </Card>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default VisualMathPuzzle;
