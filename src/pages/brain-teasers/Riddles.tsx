import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { api, Riddle } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

export default function Riddles() {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiddles = async () => {
      try {
        const data = await api.getRiddles();
        setRiddles(data);
      } catch (err) {
        setError('Failed to load riddles. Please try again later.');
        console.error('Error fetching riddles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiddles();
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mathematical Riddles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mathematical Riddles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
