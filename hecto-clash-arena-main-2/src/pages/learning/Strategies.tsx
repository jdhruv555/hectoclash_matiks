import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Zap, Puzzle, CheckCircle } from "lucide-react";

interface Strategy {
  id: string;
  title: string;
  description: string;
  steps: string[];
  example: {
    problem: string;
    solution: string[];
  };
  tips: string[];
}

const Strategies: React.FC = () => {
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  
  const strategies: Record<string, Strategy[]> = {
    "arithmetic": [
      {
        id: "mental-math",
        title: "Mental Math Shortcuts",
        description: "Techniques for performing calculations quickly in your head",
        steps: [
          "Break down complex problems into simpler ones",
          "Look for compatible numbers that are easier to work with",
          "Use rounding and compensation",
          "Apply the distributive property for multiplication"
        ],
        example: {
          problem: "Calculate 398 + 753 mentally",
          solution: [
            "Round 398 up to 400: 400 + 753 = 1,153",
            "Compensate by subtracting 2: 1,153 - 2 = 1,151"
          ]
        },
        tips: [
          "Practice with small numbers first",
          "Focus on one technique at a time until it becomes automatic",
          "Apply these techniques in everyday situations like shopping"
        ]
      },
      {
        id: "estimation",
        title: "Estimation Strategies",
        description: "Quickly find approximate answers to verify your calculations",
        steps: [
          "Round numbers to make them easier to work with",
          "Perform the calculation with the rounded numbers",
          "Determine if your estimate is higher or lower than the actual answer",
          "Use the estimate to check if your precise calculation is reasonable"
        ],
        example: {
          problem: "Estimate 18.7 × 5.2",
          solution: [
            "Round 18.7 to 20 and 5.2 to 5",
            "Calculate 20 × 5 = 100",
            "The actual answer (97.24) should be slightly less than 100"
          ]
        },
        tips: [
          "Round in a way that makes the calculation easiest",
          "Use estimation before solving problems to predict answers",
          "Consider whether precision or speed is more important for your situation"
        ]
      }
    ],
    "algebra": [
      {
        id: "substitution",
        title: "Substitution Method",
        description: "Solve systems of equations by expressing one variable in terms of another",
        steps: [
          "Choose one equation and solve for one variable",
          "Substitute that expression into the other equation",
          "Solve for the remaining variable",
          "Substitute back to find the value of the first variable"
        ],
        example: {
          problem: "Solve the system: 2x + 3y = 8 and 4x - y = 10",
          solution: [
            "From the second equation: y = 4x - 10",
            "Substitute into the first equation: 2x + 3(4x - 10) = 8",
            "Expand: 2x + 12x - 30 = 8",
            "Simplify: 14x = 38, so x = 38/14 = 19/7",
            "Substitute back: y = 4(19/7) - 10 = 76/7 - 10 = 76/7 - 70/7 = 6/7"
          ]
        },
        tips: [
          "Choose the equation that's easiest to solve for one variable",
          "Be careful with signs when substituting negative terms",
          "Check your answer by substituting back into both original equations"
        ]
      },
      {
        id: "factoring",
        title: "Factoring Techniques",
        description: "Decompose expressions into products of simpler expressions",
        steps: [
          "Identify the type of expression (difference of squares, trinomial, etc.)",
          "Apply the appropriate factoring technique",
          "Check your factorization by expanding the result"
        ],
        example: {
          problem: "Factor x² - 9x + 20",
          solution: [
            "This is a trinomial in the form x² + bx + c",
            "We need two numbers that multiply to give 20 and add to give -9",
            "The numbers are -4 and -5 since (-4)(-5) = 20 and (-4) + (-5) = -9",
            "Therefore: x² - 9x + 20 = (x - 4)(x - 5)"
          ]
        },
        tips: [
          "Look for common factors first",
          "For trinomials ax² + bx + c, find factors of ac that sum to b",
          "Practice recognizing special patterns like difference of squares"
        ]
      }
    ],
    "problem-solving": [
      {
        id: "visualization",
        title: "Visual Representation",
        description: "Convert problems into diagrams or charts to gain insights",
        steps: [
          "Identify the key elements of the problem",
          "Choose an appropriate visual representation (diagram, chart, graph)",
          "Convert the problem information into the visual format",
          "Use the visual to identify patterns or solutions"
        ],
        example: {
          problem: "A rectangle has a perimeter of 34 cm and an area of 66 cm². Find its dimensions.",
          solution: [
            "Draw a rectangle and label sides as x and y",
            "Write equations: 2x + 2y = 34 (perimeter) and xy = 66 (area)",
            "From the first equation: y = (34 - 2x)/2 = 17 - x",
            "Substitute into the area equation: x(17 - x) = 66",
            "Expand: 17x - x² = 66",
            "Rearrange: x² - 17x + 66 = 0",
            "Solve the quadratic equation to get x = 6 and y = 11"
          ]
        },
        tips: [
          "Use different colors to highlight key elements",
          "Start with a simple diagram and add details as needed",
          "Try multiple visual approaches if one doesn't yield insights"
        ]
      },
      {
        id: "work-backward",
        title: "Working Backwards",
        description: "Start from the end result and reverse the process to find the starting point",
        steps: [
          "Identify the final state or result",
          "Determine what operation was performed in the last step",
          "Undo that operation to find the previous state",
          "Continue working backwards until you reach the starting point"
        ],
        example: {
          problem: "After a 15% discount, an item costs $68. What was the original price?",
          solution: [
            "The final price is $68 after a 15% discount",
            "If the original price is x, then x - 0.15x = 68",
            "Simplify: 0.85x = 68",
            "Solve for x: x = 68 ÷ 0.85 = $80"
          ]
        },
        tips: [
          "Ensure you're inverting operations correctly (addition becomes subtraction, etc.)",
          "Keep track of what each value represents at each step",
          "Cross-check your answer by working forward from your solution"
        ]
      }
    ]
  };
  
  const toggleBookmark = (id: string) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(item => item !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };
  
  return (
    <PageLayout 
      title="Problem-Solving Strategies" 
      subtitle="Master techniques to tackle challenging math problems"
    >
      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="arithmetic" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="arithmetic" className="flex items-center gap-2">
              <Zap size={16} />
              Arithmetic
            </TabsTrigger>
            <TabsTrigger value="algebra" className="flex items-center gap-2">
              <Puzzle size={16} />
              Algebra
            </TabsTrigger>
            <TabsTrigger value="problem-solving" className="flex items-center gap-2">
              <Lightbulb size={16} />
              Problem Solving
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="flex items-center gap-2">
              <BookOpen size={16} />
              Bookmarked
            </TabsTrigger>
          </TabsList>
          
          {Object.keys(strategies).map(category => (
            <TabsContent key={category} value={category} className="space-y-6">
              {strategies[category].map(strategy => (
                <Card key={strategy.id} className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{strategy.title}</h2>
                      <p className="text-muted-foreground">{strategy.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(strategy.id)}
                      className={bookmarked.includes(strategy.id) ? "text-yellow-500" : "text-muted-foreground"}
                    >
                      <BookOpen size={20} />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium mb-2">Key Steps:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {strategy.steps.map((step, idx) => (
                          <li key={idx} className="text-sm">{step}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                      <h3 className="text-md font-medium text-blue-800 mb-2">Example:</h3>
                      <p className="font-medium text-sm mb-2">{strategy.example.problem}</p>
                      <div className="space-y-1 pl-4 border-l-2 border-blue-300">
                        {strategy.example.solution.map((step, idx) => (
                          <p key={idx} className="text-sm text-blue-800">{idx + 1}. {step}</p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-2 flex items-center gap-1">
                        <Lightbulb size={16} className="text-amber-500" />
                        Pro Tips:
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {strategy.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
          
          <TabsContent value="bookmarked" className="space-y-6">
            {bookmarked.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <BookOpen size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No bookmarked strategies yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the bookmark icon on any strategy to save it for quick reference
                </p>
              </div>
            ) : (
              <>
                {bookmarked.map(id => {
                  let found = null;
                  for (const category in strategies) {
                    const strategy = strategies[category].find(s => s.id === id);
                    if (strategy) {
                      found = strategy;
                      break;
                    }
                  }
                  
                  if (!found) return null;
                  
                  return (
                    <Card key={id} className="p-6 bg-gradient-to-br from-white to-yellow-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold">{found.title}</h2>
                          <p className="text-muted-foreground">{found.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(id)}
                          className="text-yellow-500"
                        >
                          <BookOpen size={20} />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-md font-medium mb-2">Key Steps:</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {found.steps.map((step, idx) => (
                              <li key={idx} className="text-sm">{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Strategies;
