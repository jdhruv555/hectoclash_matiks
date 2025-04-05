
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LightbulbIcon, ArrowRight, Brain, CheckCircle, XCircle, ThumbsUp, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface MathRiddle {
  id: string;
  title: string;
  question: string;
  answer: string;
  hint: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
}

const mathRiddles: MathRiddle[] = [
  {
    id: "age-riddle",
    title: "The Age Puzzle",
    question: "I am twice as old as you were when I was as old as you are now. If I am 30 years old, how old are you?",
    answer: "20",
    hint: "Try to express the relationship using algebraic equations.",
    explanation: "Let's say your current age is x. When I was your current age (x), you were some age, let's call it y. Now I'm twice as old as you were then, so 30 = 2y. This means y = 15. When I was your current age (x), you were 15. So x - 15 = 30 - x (difference in our ages remains constant). This gives us x = 20.",
    difficulty: "Medium"
  },
  {
    id: "frog-well",
    title: "Frog in the Well",
    question: "A frog is at the bottom of a 30-foot well. Each day it climbs up 3 feet, but slips down 2 feet each night. How many days will it take for the frog to reach the top of the well?",
    answer: "28",
    hint: "Track the frog's position at the end of each day.",
    explanation: "Each day, the frog makes a net progress of 1 foot (climbs 3 feet, slips 2 feet). For the first 27 days, it will climb 27 feet. On the 28th day, it will climb 3 more feet, reaching the top at 30 feet, and escaping before the night when it would slip.",
    difficulty: "Easy"
  },
  {
    id: "water-jugs",
    title: "The Water Jugs",
    question: "You have a 3-gallon jug and a 5-gallon jug. How can you measure exactly 4 gallons of water?",
    answer: "Fill 5, pour to 3, empty 3, pour from 5 to 3",
    hint: "Think about filling one jug, then pouring into the other.",
    explanation: "1. Fill the 5-gallon jug completely (5 gallons)\n2. Pour from the 5-gallon jug into the 3-gallon jug until it's full (5-3 = 2 gallons remain in the 5-gallon jug)\n3. Empty the 3-gallon jug\n4. Pour the 2 gallons from the 5-gallon jug into the 3-gallon jug\n5. Fill the 5-gallon jug completely\n6. Pour from the 5-gallon jug into the 3-gallon jug until it's full (only 1 gallon will fit, as it already has 2 gallons)\n7. The 5-gallon jug now has exactly 4 gallons",
    difficulty: "Medium"
  },
  {
    id: "clock-hands",
    title: "Clock Hands",
    question: "How many times do the hands of a clock overlap in a 12-hour period?",
    answer: "11",
    hint: "Consider when the hands would be exactly aligned.",
    explanation: "The hour and minute hands overlap exactly 11 times in 12 hours. They do not overlap at 12 o'clock, as many might initially think, because the hour hand is already slightly ahead when the minute hand reaches 12. The hands overlap at approximately 1:05:27, 2:10:55, 3:16:22, and so on.",
    difficulty: "Medium"
  },
  {
    id: "river-crossing",
    title: "The River Crossing",
    question: "A farmer needs to cross a river with a wolf, a goat, and a cabbage. The boat can only hold the farmer and one item. If left unattended, the wolf will eat the goat, and the goat will eat the cabbage. How can the farmer get all three across safely?",
    answer: "Goat, return, wolf, goat, cabbage, goat",
    hint: "Think about which item can be left alone with the others.",
    explanation: "1. Take the goat across, return alone.\n2. Take the wolf across, bring the goat back.\n3. Leave the goat, take the cabbage across.\n4. Return alone, then take the goat across.\n\nThe key insight is recognizing that the goat can never be left with either the wolf or the cabbage, but the wolf and cabbage can be left together.",
    difficulty: "Medium"
  },
  {
    id: "handshakes",
    title: "The Handshake Problem",
    question: "In a room of 10 people, each person shakes hands exactly once with everyone else. How many handshakes occur in total?",
    answer: "45",
    hint: "Consider the combinations formula or think of it as a network problem.",
    explanation: "To find the total number of handshakes, we need to find the number of ways to select 2 people from 10, since each handshake involves 2 people. Using the combination formula: C(10,2) = 10! / (2! × 8!) = (10 × 9) / 2 = 45 handshakes.",
    difficulty: "Easy"
  },
  {
    id: "monks-puzzle",
    title: "The Monks Puzzle",
    question: "Three monks walk up a mountain at different speeds. The first reaches the top in 1 hour, the second in 2 hours, and the third in 3 hours. If they all start at the same time, how many times will they meet on the path?",
    answer: "0",
    hint: "Consider where and when they would meet.",
    explanation: "The monks will not meet on the path at all. Once a monk reaches the top, they stay there (as per the standard interpretation of this riddle). The first monk reaches the top before the others, and the second reaches the top before the third. Since they're always moving in the same direction and never turn back, they can't meet on the path.",
    difficulty: "Hard"
  },
  {
    id: "liars-truth",
    title: "Liars and Truth-Tellers",
    question: "You come to a fork in the road and need to find the path to a village. Two people stand there: one always tells the truth, and one always lies, but you don't know who is who. You can ask only one question to one person. What question would guarantee you find the right path?",
    answer: "What would the other person say is the path to the village?",
    hint: "Think about how to use one person's response to determine what the other would say.",
    explanation: "Ask either person: 'What would the other person say is the path to the village?'\n\nIf you ask the truth-teller, they will honestly tell you what the liar would say, which would be the wrong path.\nIf you ask the liar, they will lie about what the truth-teller would say, which would also indicate the wrong path.\n\nIn either case, you'll get the wrong answer, so take the opposite path.",
    difficulty: "Hard"
  },
  {
    id: "digit-sum",
    title: "The Digit Sum Puzzle",
    question: "Find the smallest positive integer such that the sum of its digits is 100.",
    answer: "19999999999",
    hint: "Think about which digits give you the most 'bang for your buck' in terms of value vs. sum contribution.",
    explanation: "To minimize the number while having its digits sum to 100, we want to use the digit 9 as much as possible. Each digit 9 contributes the maximum possible to the sum. So we get 11 nines (9×11 = 99) and then a 1 at the beginning: 19999999999. The sum is 1+9+9+9+9+9+9+9+9+9+9+9 = 100.",
    difficulty: "Medium"
  },
  {
    id: "coin-weighing",
    title: "Counterfeit Coin",
    question: "You have 12 coins, one of which is counterfeit and either heavier or lighter than the rest. With a balance scale, what's the minimum number of weighings needed to identify the counterfeit coin and determine if it's heavier or lighter?",
    answer: "3",
    hint: "Think about dividing the coins into equal groups for the first weighing.",
    explanation: "This can be solved with 3 weighings:\n\n1. Weigh 4 coins against 4 coins, leaving 4 aside.\n2. If balanced, the counterfeit is in the remaining 4. If not, it's in the 8 you weighed.\n3. Further strategic weighings will identify both the coin and whether it's heavier or lighter.\n\nThe full solution is complex but can be proven to require exactly 3 weighings in the worst case.",
    difficulty: "Expert"
  }
];

const Riddles: React.FC = () => {
  const [currentRiddle, setCurrentRiddle] = useState<MathRiddle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<string>("All");
  const [solvedRiddles, setSolvedRiddles] = useState<string[]>([]);
  
  // Get a random riddle based on difficulty
  const getRandomRiddle = () => {
    let filteredRiddles = [...mathRiddles];
    
    if (difficulty !== "All") {
      filteredRiddles = filteredRiddles.filter(r => r.difficulty === difficulty);
    }
    
    // Exclude already solved riddles if possible
    let availableRiddles = filteredRiddles.filter(r => !solvedRiddles.includes(r.id));
    
    // If all riddles in the category are solved, reset
    if (availableRiddles.length === 0) {
      availableRiddles = filteredRiddles;
    }
    
    const randomIndex = Math.floor(Math.random() * availableRiddles.length);
    return availableRiddles[randomIndex];
  };
  
  // Start a new riddle
  const startNewRiddle = () => {
    const riddle = getRandomRiddle();
    setCurrentRiddle(riddle);
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setIsCorrect(null);
    
    toast.info(`New riddle: ${riddle.title}`);
  };
  
  // Check the user's answer
  const checkAnswer = () => {
    if (!currentRiddle || !userAnswer.trim()) return;
    
    // We'll do a simple check that allows for multiple correct formulations
    const userAnswerLower = userAnswer.toLowerCase().trim();
    const correctAnswerLower = currentRiddle.answer.toLowerCase();
    
    // Check if the user's answer contains the key elements of the correct answer
    const isAnswerCorrect = 
      userAnswerLower === correctAnswerLower || 
      correctAnswerLower.includes(userAnswerLower) ||
      userAnswerLower.includes(correctAnswerLower);
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      toast.success("Correct! Well done!");
      
      // Add to solved riddles
      if (!solvedRiddles.includes(currentRiddle.id)) {
        setSolvedRiddles([...solvedRiddles, currentRiddle.id]);
      }
    } else {
      toast.error("Not quite right. Try again or check the hint!");
    }
  };
  
  return (
    <PageLayout 
      title="Mathematical Riddles" 
      subtitle="Challenge your logical thinking with brain-teasing math puzzles"
      showProgress
      progressValue={(solvedRiddles.length / mathRiddles.length) * 100}
    >
      <div className="w-full max-w-4xl mx-auto">
        {!currentRiddle ? (
          <Card className="p-6 bg-card/70 border-white/10 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-primary">Mathematical Riddles & Logic Puzzles</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Difficulty</h3>
              <div className="grid grid-cols-5 gap-2">
                {["All", "Easy", "Medium", "Hard", "Expert"].map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => setDifficulty(level)}
                    className={`${
                      difficulty === level 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-muted/20 border border-white/10">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="text-primary h-5 w-5" />
                  <span>Benefits of Mathematical Riddles</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Enhance logical reasoning and critical thinking</li>
                  <li>Improve problem-solving abilities</li>
                  <li>Develop creative mathematical approaches</li>
                  <li>Strengthen algebraic thinking</li>
                  <li>Prepare for mathematical competitions</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="text-primary h-5 w-5" />
                  <span>Your Progress</span>
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-3xl font-bold text-primary">{solvedRiddles.length}</div>
                  <div className="text-sm text-muted-foreground">of {mathRiddles.length} riddles solved</div>
                </div>
                <div className="mt-2 bg-black/40 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{width: `${(solvedRiddles.length / mathRiddles.length) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startNewRiddle}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <LightbulbIcon size={20} />
              Start Riddle Challenge
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-card border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-primary">{currentRiddle.title}</h2>
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                  {currentRiddle.difficulty}
                </div>
              </div>
              
              <div className="bg-black/40 p-5 rounded-lg border border-white/10 mb-6">
                <p className="text-lg">{currentRiddle.question}</p>
              </div>
              
              {!showSolution ? (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="answer" className="text-sm font-medium">
                      Your Answer:
                    </label>
                    <Input
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="bg-muted/20 border-white/20"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(!showHint)}
                      className="border-white/20 hover:bg-white/5"
                    >
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                    
                    <Button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Check Answer
                    </Button>
                  </div>
                  
                  {showHint && (
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h3 className="text-sm font-medium mb-1">Hint:</h3>
                      <p className="text-sm text-muted-foreground">{currentRiddle.hint}</p>
                    </div>
                  )}
                  
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect 
                        ? "bg-green-900/10 border border-green-900/30" 
                        : "bg-red-900/10 border border-red-900/30"
                    }`}>
                      <div className="flex items-center gap-2">
                        {isCorrect 
                          ? <CheckCircle size={20} className="text-green-500" />
                          : <XCircle size={20} className="text-red-500" />
                        }
                        <p className="font-medium">
                          {isCorrect 
                            ? "Correct! Well done!" 
                            : "Not quite right. Try again or check the solution."}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowSolution(true)}
                      className="border-white/20 hover:bg-white/5"
                    >
                      Show Solution
                    </Button>
                    
                    <Button
                      onClick={startNewRiddle}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                    >
                      Next Riddle <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-medium mb-2">Solution:</h3>
                    <p className="text-primary font-bold mb-3">{currentRiddle.answer}</p>
                    <h4 className="text-sm font-medium mb-1">Explanation:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{currentRiddle.explanation}</p>
                  </div>
                  
                  <Button
                    onClick={startNewRiddle}
                    className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    Next Riddle <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </Card>
            
            <Button 
              variant="outline" 
              onClick={() => setCurrentRiddle(null)}
              className="w-full border-white/20 hover:bg-white/5"
            >
              Back to Riddle Selection
            </Button>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
            <LightbulbIcon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Mathematical Insight</h3>
            <p className="text-sm text-muted-foreground">Riddles help develop mathematical intuition and the ability to see connections between seemingly disparate concepts.</p>
          </div>
          
          <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
            <Brain className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Analytical Thinking</h3>
            <p className="text-sm text-muted-foreground">The process of breaking down complex problems into manageable parts is a transferable skill for all areas of mathematics.</p>
          </div>
          
          <div className="p-5 rounded-lg bg-gradient-to-br from-red-900/30 to-black border border-white/10 flex flex-col items-center text-center">
            <ThumbsUp className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Persistence</h3>
            <p className="text-sm text-muted-foreground">Challenging riddles teach the value of perseverance and trying multiple approaches when solving difficult problems.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Riddles;
