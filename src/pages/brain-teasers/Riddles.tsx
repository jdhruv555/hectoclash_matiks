import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Riddle {
  question: string;
  answer: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const riddles: Riddle[] = [
  {
    question: "I am a number that when multiplied by 3 and then divided by 2 gives 9. What am I?",
    answer: "6",
    hint: "Try working backwards from 9",
    difficulty: "easy"
  },
  {
    question: "If you have 12 apples and take away 3, then add 5, and finally divide by 2, how many apples do you have?",
    answer: "7",
    hint: "Follow the operations step by step",
    difficulty: "easy"
  },
  {
    question: "A number is increased by 25% and then decreased by 20%. The final result is 100. What was the original number?",
    answer: "100",
    hint: "Let x be the original number and solve the equation",
    difficulty: "medium"
  },
  {
    question: "If 2^x = 16 and 3^y = 27, what is x + y?",
    answer: "7",
    hint: "Find the values of x and y separately",
    difficulty: "medium"
  },
  {
    question: "The sum of three consecutive even numbers is 54. What is the largest number?",
    answer: "20",
    hint: "Let n be the smallest number and write an equation",
    difficulty: "hard"
  }
];

export default function Riddles() {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleSubmit = () => {
    if (userAnswer.toLowerCase().trim() === riddles[currentRiddle].answer.toLowerCase().trim()) {
      setScore(score + 1);
      setProgress((score + 1) / riddles.length * 100);
    }
    setShowAnswer(true);
  };

  const nextRiddle = () => {
    if (currentRiddle < riddles.length - 1) {
      setCurrentRiddle(currentRiddle + 1);
      setUserAnswer('');
      setShowHint(false);
      setShowAnswer(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mathematical Riddles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="text-center">
              <p className="text-lg font-semibold">Score: {score}/{riddles.length}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Riddle {currentRiddle + 1} of {riddles.length}</Label>
              <p className="text-lg">{riddles[currentRiddle].question}</p>
              
              <div className="flex gap-2">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  disabled={showAnswer}
                />
                <Button onClick={handleSubmit} disabled={showAnswer}>
                  Submit
                </Button>
              </div>

              {!showAnswer && (
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
              )}

              {showHint && (
                <p className="text-sm text-muted-foreground">
                  Hint: {riddles[currentRiddle].hint}
                </p>
              )}

              {showAnswer && (
                <div className="space-y-2">
                  <p className="font-semibold">
                    {userAnswer.toLowerCase().trim() === riddles[currentRiddle].answer.toLowerCase().trim()
                      ? 'Correct!'
                      : 'Incorrect. The answer is: ' + riddles[currentRiddle].answer}
                  </p>
                  <Button onClick={nextRiddle} className="w-full">
                    Next Riddle
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
