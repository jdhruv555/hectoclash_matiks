
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Zap, Brain, CheckCircle, XCircle, RotateCcw, Calculator, Clock, Award, LightbulbIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface MathProblem {
  question: string;
  options: number[];
  correctAnswer: number;
  explanation: string;
}

interface MathTrick {
  id: string;
  title: string;
  description: string;
  steps: string[];
  examples: {question: string, solution: string}[];
  category: string;
  difficulty: string;
}

type GameDifficulty = "easy" | "medium" | "hard";
type GameCategory = "addition" | "subtraction" | "multiplication" | "division" | "mixed";

const mentalMathTricks: MathTrick[] = [
  {
    id: "multiply-by-11",
    title: "Multiplying Any 2-Digit Number by 11",
    description: "A quick way to multiply two-digit numbers by 11",
    steps: [
      "Take the original two-digit number (for example, 25)",
      "Add the two digits together (2 + 5 = 7)",
      "Place the sum between the original digits (2_5 becomes 275)"
    ],
    examples: [
      {question: "25 × 11", solution: "25 × 11 = 275 (2 and 5, with 2+5=7 between them)"},
      {question: "36 × 11", solution: "36 × 11 = 396 (3 and 6, with 3+6=9 between them)"},
      {question: "83 × 11", solution: "83 × 11 = 913 (8 and 3, with 8+3=11, so 8+1 and 1+3, giving 913)"}
    ],
    category: "multiplication",
    difficulty: "easy"
  },
  {
    id: "square-numbers-ending-5",
    title: "Squaring Numbers Ending in 5",
    description: "A pattern to quickly square any number ending in 5",
    steps: [
      "Take a number ending in 5 (for example, 35)",
      "Multiply the first digit(s) by the next higher number (3 × 4 = 12)",
      "Append 25 to the result (1225)"
    ],
    examples: [
      {question: "35²", solution: "35² = 1225 (3 × 4 = 12, append 25)"},
      {question: "65²", solution: "65² = 4225 (6 × 7 = 42, append 25)"},
      {question: "95²", solution: "95² = 9025 (9 × 10 = 90, append 25)"}
    ],
    category: "multiplication",
    difficulty: "medium"
  },
  {
    id: "multiply-by-9",
    title: "Fast Multiplication by 9",
    description: "Use a simple pattern to multiply by 9",
    steps: [
      "To multiply a number by 9, first multiply it by 10",
      "Then subtract the original number from the result"
    ],
    examples: [
      {question: "7 × 9", solution: "7 × 10 = 70, 70 - 7 = 63"},
      {question: "12 × 9", solution: "12 × 10 = 120, 120 - 12 = 108"},
      {question: "25 × 9", solution: "25 × 10 = 250, 250 - 25 = 225"}
    ],
    category: "multiplication",
    difficulty: "easy"
  },
  {
    id: "percentage-calculation",
    title: "Quick Percentage Calculations",
    description: "Easily calculate percentages using the commutative property",
    steps: [
      "To find x% of y, you can calculate y% of x (they're the same)",
      "Choose the calculation that's easier to perform mentally"
    ],
    examples: [
      {question: "Find 25% of 48", solution: "Same as 48% of 25: 48 ÷ 4 = 12 (that's 25% of 48)"},
      {question: "Find 8% of 50", solution: "Same as 50% of 8: 8 ÷ 2 = 4 (that's 8% of 50)"},
      {question: "Find 20% of 35", solution: "Same as 35% of 20: 20 ÷ 5 = 4 × 7 = 7 (that's 20% of 35)"}
    ],
    category: "percentages",
    difficulty: "medium"
  },
  {
    id: "add-from-left",
    title: "Add Numbers from Left to Right",
    description: "A more intuitive way to add large numbers",
    steps: [
      "Instead of adding from right to left, start from left to right",
      "Add the largest place values first, then work downward",
      "Make adjustments for carrying as you go"
    ],
    examples: [
      {question: "367 + 452", solution: "300 + 400 = 700, 60 + 50 = 110, 700 + 110 = 810, 7 + 2 = 9, 810 + 9 = 819"},
      {question: "5842 + 2317", solution: "5000 + 2000 = 7000, 800 + 300 = 1100, 7000 + 1100 = 8100, 40 + 10 = 50, 8100 + 50 = 8150, 2 + 7 = 9, 8150 + 9 = 8159"},
      {question: "1399 + 2678", solution: "1000 + 2000 = 3000, 300 + 600 = 900, 3000 + 900 = 3900, 90 + 70 = 160, 3900 + 160 = 4060, 9 + 8 = 17, 4060 + 17 = 4077"}
    ],
    category: "addition",
    difficulty: "easy"
  }
];

const MentalMath = () => {
  const [activeCategory, setActiveCategory] = useState<GameCategory>("addition");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");
  const [gameActive, setGameActive] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activeSection, setActiveSection] = useState<"challenge" | "tricks">("challenge");
  const [activeTrick, setActiveTrick] = useState(mentalMathTricks[0].id);
  
  // Generate addition problems
  const generateAdditionProblems = (difficulty: GameDifficulty): MathProblem[] => {
    const problems: MathProblem[] = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      let num1, num2;
      
      if (difficulty === "easy") {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
      } else if (difficulty === "medium") {
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
      } else {
        num1 = Math.floor(Math.random() * 100) + 50;
        num2 = Math.floor(Math.random() * 100) + 50;
      }
      
      const correctAnswer = num1 + num2;
      const options = generateOptions(correctAnswer, difficulty);
      
      problems.push({
        question: `${num1} + ${num2} = ?`,
        options,
        correctAnswer,
        explanation: `${num1} + ${num2} = ${correctAnswer}`
      });
    }
    
    return problems;
  };
  
  // Generate subtraction problems
  const generateSubtractionProblems = (difficulty: GameDifficulty): MathProblem[] => {
    const problems: MathProblem[] = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      let num1, num2;
      
      if (difficulty === "easy") {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else if (difficulty === "medium") {
        num1 = Math.floor(Math.random() * 50) + 30;
        num2 = Math.floor(Math.random() * 30) + 1;
      } else {
        num1 = Math.floor(Math.random() * 100) + 50;
        num2 = Math.floor(Math.random() * 50) + 1;
      }
      
      // Ensure num1 > num2
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      
      const correctAnswer = num1 - num2;
      const options = generateOptions(correctAnswer, difficulty);
      
      problems.push({
        question: `${num1} - ${num2} = ?`,
        options,
        correctAnswer,
        explanation: `${num1} - ${num2} = ${correctAnswer}`
      });
    }
    
    return problems;
  };
  
  // Generate multiplication problems
  const generateMultiplicationProblems = (difficulty: GameDifficulty): MathProblem[] => {
    const problems: MathProblem[] = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      let num1, num2;
      
      if (difficulty === "easy") {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else if (difficulty === "medium") {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
      } else {
        num1 = Math.floor(Math.random() * 20) + 5;
        num2 = Math.floor(Math.random() * 10) + 5;
      }
      
      const correctAnswer = num1 * num2;
      const options = generateOptions(correctAnswer, difficulty);
      
      problems.push({
        question: `${num1} × ${num2} = ?`,
        options,
        correctAnswer,
        explanation: `${num1} × ${num2} = ${correctAnswer}`
      });
    }
    
    return problems;
  };
  
  // Generate division problems
  const generateDivisionProblems = (difficulty: GameDifficulty): MathProblem[] => {
    const problems: MathProblem[] = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      let num1, num2, correctAnswer;
      
      if (difficulty === "easy") {
        num2 = Math.floor(Math.random() * 5) + 1;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = correctAnswer * num2;
      } else if (difficulty === "medium") {
        num2 = Math.floor(Math.random() * 10) + 2;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = correctAnswer * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 3;
        correctAnswer = Math.floor(Math.random() * 15) + 5;
        num1 = correctAnswer * num2;
      }
      
      const options = generateOptions(correctAnswer, difficulty);
      
      problems.push({
        question: `${num1} ÷ ${num2} = ?`,
        options,
        correctAnswer,
        explanation: `${num1} ÷ ${num2} = ${correctAnswer}`
      });
    }
    
    return problems;
  };
  
  // Generate mixed problems
  const generateMixedProblems = (difficulty: GameDifficulty): MathProblem[] => {
    const additionProblems = generateAdditionProblems(difficulty).slice(0, 2);
    const subtractionProblems = generateSubtractionProblems(difficulty).slice(0, 1);
    const multiplicationProblems = generateMultiplicationProblems(difficulty).slice(0, 1);
    const divisionProblems = generateDivisionProblems(difficulty).slice(0, 1);
    
    return [...additionProblems, ...subtractionProblems, ...multiplicationProblems, ...divisionProblems]
      .sort(() => Math.random() - 0.5);
  };
  
  // Generate answer options
  const generateOptions = (correctAnswer: number, difficulty: GameDifficulty): number[] => {
    const options = [correctAnswer];
    let range = 5;
    
    if (difficulty === "medium") range = 10;
    if (difficulty === "hard") range = 20;
    
    while (options.length < 4) {
      let option;
      if (Math.random() > 0.5) {
        option = correctAnswer + Math.floor(Math.random() * range) + 1;
      } else {
        option = correctAnswer - Math.floor(Math.random() * range) - 1;
      }
      
      // Avoid negative numbers or duplicates
      if (option > 0 && !options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };
  
  // Start a new game
  const startGame = () => {
    // Generate problems based on selected category and difficulty
    let newProblems: MathProblem[] = [];
    
    switch (activeCategory) {
      case "addition":
        newProblems = generateAdditionProblems(difficulty);
        break;
      case "subtraction":
        newProblems = generateSubtractionProblems(difficulty);
        break;
      case "multiplication":
        newProblems = generateMultiplicationProblems(difficulty);
        break;
      case "division":
        newProblems = generateDivisionProblems(difficulty);
        break;
      case "mixed":
        newProblems = generateMixedProblems(difficulty);
        break;
    }
    
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setSelectedAnswer(null);
    setShowResult(false);
    setTotalCorrect(0);
    setQuestionsCompleted(0);
    
    toast.info(`Starting ${difficulty} ${activeCategory} challenge!`);
  };
  
  // End the game
  const endGame = () => {
    setGameActive(false);
    toast.info(`Game over! Final score: ${score}`);
  };
  
  // Check the selected answer
  const checkAnswer = (selectedOption: number) => {
    if (!gameActive || showResult) return;
    
    const currentProblem = problems[currentProblemIndex];
    const isCorrect = selectedOption === currentProblem.correctAnswer;
    
    setSelectedAnswer(selectedOption);
    setShowResult(true);
    setQuestionsCompleted(questionsCompleted + 1);
    
    if (isCorrect) {
      // Award points based on difficulty and time left
      let pointsEarned = 0;
      switch (difficulty) {
        case "easy": pointsEarned = 10; break;
        case "medium": pointsEarned = 20; break;
        case "hard": pointsEarned = 30; break;
      }
      
      // Time bonus
      const timeBonus = Math.floor(timeLeft / 3);
      const totalPoints = pointsEarned + timeBonus;
      
      setScore(score + totalPoints);
      setTotalCorrect(totalCorrect + 1);
      
      toast.success(`Correct! +${totalPoints} points`);
    } else {
      toast.error("Incorrect answer!");
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentProblemIndex < problems.length - 1) {
        setCurrentProblemIndex(currentProblemIndex + 1);
        setShowResult(false);
        setSelectedAnswer(null);
        setTimeLeft(30); // Reset timer for each question
      } else {
        // Game completed
        endGame();
      }
    }, 2000);
  };
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive && !showResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameActive && timeLeft === 0 && !showResult) {
      // Time's up for this question
      setShowResult(true);
      setQuestionsCompleted(questionsCompleted + 1);
      toast.error("Time's up!");
      
      // Move to next question after a delay
      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(30); // Reset timer for each question
        } else {
          // Game completed
          endGame();
        }
      }, 2000);
    }
    
    return () => clearInterval(timer);
  }, [gameActive, showResult, timeLeft, currentProblemIndex, problems.length]);
  
  // Get the active trick
  const currentTrick = mentalMathTricks.find(trick => trick.id === activeTrick) || mentalMathTricks[0];
  
  return (
    <PageLayout 
      title="Mental Math Mastery" 
      subtitle="Improve your ability to calculate quickly in your head"
      showProgress={gameActive}
      progressValue={gameActive ? ((currentProblemIndex + 1) / problems.length) * 100 : 0}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Tabs 
          value={activeSection} 
          onValueChange={(value) => setActiveSection(value as "challenge" | "tricks")}
          className="mb-6"
        >
          <TabsList className="mb-4 bg-muted/50">
            <TabsTrigger value="challenge" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Speed Challenge
            </TabsTrigger>
            <TabsTrigger value="tricks" className="flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4" />
              Mental Math Tricks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenge">
            {!gameActive ? (
              <Card className="p-6 mb-6 bg-card/70 border-white/10 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-primary">Choose a Category</h2>
                
                <Tabs 
                  value={activeCategory} 
                  onValueChange={setActiveCategory as (value: string) => void}
                  className="mb-6"
                >
                  <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
                    <TabsTrigger value="addition">Addition</TabsTrigger>
                    <TabsTrigger value="subtraction">Subtraction</TabsTrigger>
                    <TabsTrigger value="multiplication">Multiplication</TabsTrigger>
                    <TabsTrigger value="division">Division</TabsTrigger>
                    <TabsTrigger value="mixed">Mixed</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <h2 className="text-xl font-bold mb-4 text-primary">Select Difficulty</h2>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level as GameDifficulty)}
                      className={`h-16 ${difficulty === level ? 'bg-primary hover:bg-primary/90 text-white' : 'border-white/20 hover:bg-white/5'}`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  onClick={startGame}
                  className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 animate-pulse"
                >
                  <Zap size={20} />
                  Start Challenge
                </Button>
                
                <div className="mt-8 bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Award size={18} className="text-primary" />
                    <span>Challenge Rules</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Solve each problem as quickly as possible</li>
                    <li>You have 30 seconds per question</li>
                    <li>Points are awarded based on difficulty and speed</li>
                    <li>Try to solve mentally without using a calculator</li>
                    <li>Complete all questions to see your final score</li>
                  </ul>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full">
                    <Brain size={18} />
                    <span className="font-medium">Problem {currentProblemIndex + 1}/{problems.length}</span>
                  </div>
                  <div className="bg-black/50 text-white px-4 py-2 rounded-full font-medium border border-white/10">
                    Score: {score}
                  </div>
                </div>
                
                <div className="relative w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${
                      timeLeft > 10 ? 'bg-primary' : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock size={14} />
                  <span>{timeLeft} seconds remaining</span>
                </div>
                
                <Card className="p-6 bg-card border-white/10 shadow-lg">
                  <h2 className="text-2xl font-bold text-center mb-8 text-primary">
                    {problems[currentProblemIndex]?.question}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {problems[currentProblemIndex]?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        onClick={() => checkAnswer(option)}
                        className={`py-6 text-xl border-white/20 ${
                          showResult && selectedAnswer === option
                            ? option === problems[currentProblemIndex].correctAnswer
                              ? "bg-green-900/20 text-green-300 border-green-700"
                              : "bg-red-900/20 text-red-300 border-red-700"
                            : showResult && option === problems[currentProblemIndex].correctAnswer
                            ? "bg-green-900/20 text-green-300 border-green-700"
                            : "hover:bg-white/5"
                        }`}
                        disabled={showResult}
                      >
                        {option}
                        {showResult && selectedAnswer === option && option === problems[currentProblemIndex].correctAnswer && (
                          <CheckCircle className="ml-2 text-green-600" size={20} />
                        )}
                        {showResult && selectedAnswer === option && option !== problems[currentProblemIndex].correctAnswer && (
                          <XCircle className="ml-2 text-red-600" size={20} />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {showResult && (
                    <div className={`mt-6 p-4 rounded-lg ${
                      selectedAnswer === problems[currentProblemIndex].correctAnswer
                        ? "bg-green-900/10 border border-green-900/30"
                        : "bg-red-900/10 border border-red-900/30"
                    }`}>
                      <p className="font-medium">
                        {selectedAnswer === problems[currentProblemIndex].correctAnswer
                          ? "Correct!"
                          : "Incorrect!"
                        }
                      </p>
                      <p className="text-sm mt-1">
                        {problems[currentProblemIndex].explanation}
                      </p>
                    </div>
                  )}
                </Card>
                
                <Button 
                  variant="outline" 
                  onClick={endGame}
                  className="w-full flex items-center justify-center gap-2 border-white/20 hover:bg-white/5"
                >
                  <RotateCcw size={16} />
                  End Game
                </Button>
                
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Accuracy</span>
                    <span className="text-sm font-medium">
                      {questionsCompleted > 0 
                        ? `${Math.round((totalCorrect / questionsCompleted) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={questionsCompleted > 0 ? (totalCorrect / questionsCompleted) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tricks">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="p-4 bg-card/70 backdrop-blur-sm border-white/10 h-full">
                  <h3 className="text-lg font-bold mb-4 text-primary">Mental Math Techniques</h3>
                  
                  <div className="space-y-2">
                    {mentalMathTricks.map((trick) => (
                      <Button
                        key={trick.id}
                        variant="outline"
                        className={`w-full justify-start text-left h-auto py-3 px-4 ${
                          activeTrick === trick.id 
                            ? 'bg-primary/20 text-primary border-primary/50' 
                            : 'border-white/20 hover:bg-white/5'
                        }`}
                        onClick={() => setActiveTrick(trick.id)}
                      >
                        <div>
                          <div className="font-medium">{trick.title}</div>
                          <div className="text-xs text-muted-foreground">{trick.category} • {trick.difficulty}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="p-6 bg-card border-white/10 h-full">
                  <h2 className="text-2xl font-bold mb-2 text-primary">
                    {currentTrick.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{currentTrick.description}</p>
                  
                  <div className="space-y-6">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                      <h3 className="font-medium mb-3 text-white">How to do it:</h3>
                      <ol className="list-decimal pl-5 space-y-3">
                        {currentTrick.steps.map((step, index) => (
                          <li key={index} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <h3 className="font-medium mb-3 text-primary">Examples:</h3>
                      <div className="space-y-4">
                        {currentTrick.examples.map((example, index) => (
                          <div key={index}>
                            <p className="font-bold text-lg">{example.question}</p>
                            <p className="text-muted-foreground text-sm">{example.solution}</p>
                            {index < currentTrick.examples.length - 1 && <Separator className="my-3 bg-white/10" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <LightbulbIcon size={18} className="text-primary" />
                        <span>Why this works:</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentTrick.id === "multiply-by-11" && "This trick works because multiplying by 11 is the same as multiplying by 10 and then adding the original number. When you place the sum of digits between the original digits, you're effectively doing this operation."}
                        {currentTrick.id === "square-numbers-ending-5" && "This pattern works because (10a+5)² = 100a² + 2(10a)(5) + 5² = 100a² + 100a + 25 = 100a(a+1) + 25, where a is the tens digit."}
                        {currentTrick.id === "multiply-by-9" && "This works because 9 is one less than 10, so multiplying by 9 is the same as multiplying by 10 and then subtracting the original number once."}
                        {currentTrick.id === "percentage-calculation" && "Percentages are commutative because they involve multiplication, which is commutative. x% of y = (x/100) × y = xy/100, which is the same as (y/100) × x = y% of x."}
                        {currentTrick.id === "add-from-left" && "This approach works because addition is both associative and commutative. It's often easier for our brains to work with larger units first, and this method leverages that natural tendency."}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
                <BookOpen className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Learn Through Practice</h3>
                <p className="text-sm text-muted-foreground">Regular practice of mental math techniques strengthens neural pathways, making calculations faster and more accurate over time.</p>
              </div>
              
              <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
                <Brain className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Boost Brain Function</h3>
                <p className="text-sm text-muted-foreground">Mental math engages multiple areas of the brain simultaneously, improving overall cognitive function and memory.</p>
              </div>
              
              <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
                <Calculator className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">Real-World Application</h3>
                <p className="text-sm text-muted-foreground">These skills are useful in everyday situations like shopping, cooking, budgeting, and any scenario requiring quick calculations.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MentalMath;
