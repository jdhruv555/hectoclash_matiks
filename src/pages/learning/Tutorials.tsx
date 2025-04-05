
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TutorialContent {
  title: string;
  description: string;
  content: string[];
  examples: string[];
  completed: boolean;
}

const Tutorials: React.FC = () => {
  const [activeTutorial, setActiveTutorial] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState<number[]>([]);
  
  const tutorials: TutorialContent[] = [
    {
      title: "Basic Arithmetic",
      description: "Master the fundamental operations: addition, subtraction, multiplication, and division",
      content: [
        "Addition is the most basic operation in arithmetic. It combines two numbers to find their sum.",
        "Subtraction is the inverse of addition. It finds the difference between two numbers.",
        "Multiplication is repeated addition. It finds the product of two numbers.",
        "Division is the inverse of multiplication. It finds the quotient of two numbers."
      ],
      examples: [
        "Addition: 5 + 3 = 8",
        "Subtraction: 9 - 4 = 5",
        "Multiplication: 6 × 7 = 42",
        "Division: 15 ÷ 3 = 5"
      ],
      completed: false
    },
    {
      title: "Fractions",
      description: "Learn how to work with parts of a whole through fractions",
      content: [
        "A fraction represents a part of a whole. It consists of a numerator (top) and denominator (bottom).",
        "To add or subtract fractions, you need a common denominator.",
        "To multiply fractions, multiply the numerators together and the denominators together.",
        "To divide by a fraction, multiply by its reciprocal."
      ],
      examples: [
        "Adding fractions: 1/4 + 2/4 = 3/4",
        "Subtracting fractions: 5/6 - 1/6 = 4/6 = 2/3",
        "Multiplying fractions: 2/3 × 3/4 = 6/12 = 1/2",
        "Dividing fractions: 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2"
      ],
      completed: false
    },
    {
      title: "Decimals",
      description: "Understand decimal notation and operations with decimal numbers",
      content: [
        "Decimals are another way to represent fractions, especially tenths, hundredths, etc.",
        "The decimal point separates the whole number part from the fractional part.",
        "To add or subtract decimals, line up the decimal points.",
        "To multiply decimals, multiply as with whole numbers, then place the decimal point."
      ],
      examples: [
        "0.25 is equivalent to 25/100 or 1/4",
        "Adding decimals: 3.14 + 2.86 = 6.00",
        "Multiplying decimals: 0.5 × 0.2 = 0.10",
        "Converting between fractions and decimals: 3/4 = 0.75"
      ],
      completed: false
    }
  ];
  
  const markCompleted = () => {
    if (!completedTutorials.includes(activeTutorial)) {
      setCompletedTutorials([...completedTutorials, activeTutorial]);
    }
    
    // Move to next tutorial if available
    if (activeTutorial < tutorials.length - 1) {
      setActiveTutorial(activeTutorial + 1);
      setActiveStep(0);
    }
  };
  
  const nextStep = () => {
    if (activeStep < tutorials[activeTutorial].content.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const progressPercentage = (completedTutorials.length / tutorials.length) * 100;
  
  return (
    <PageLayout 
      title="Math Tutorials" 
      subtitle="Master foundational mathematical concepts step by step"
      showProgress
      progressValue={progressPercentage}
    >
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <GraduationCap className="text-blue-600" />
            Tutorial Topics
          </h3>
          
          {tutorials.map((tutorial, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-colors ${
                activeTutorial === index 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                setActiveTutorial(index);
                setActiveStep(0);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{tutorial.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {tutorial.description}
                  </p>
                </div>
                {completedTutorials.includes(index) && (
                  <CheckCircle2 size={16} className="text-green-600 mt-1" />
                )}
              </div>
            </Card>
          ))}
          
          <div className="pt-2">
            <Progress value={progressPercentage} className="h-2"/>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTutorials.length} of {tutorials.length} completed
            </p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50">
            <h2 className="text-2xl font-bold mb-1">{tutorials[activeTutorial].title}</h2>
            <p className="text-muted-foreground mb-6">{tutorials[activeTutorial].description}</p>
            
            <div className="bg-white p-4 rounded-lg border mb-6">
              <h3 className="font-medium mb-3">Step {activeStep + 1}</h3>
              <p className="mb-6">{tutorials[activeTutorial].content[activeStep]}</p>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Example:</h4>
                <p className="text-blue-800">{tutorials[activeTutorial].examples[activeStep]}</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={activeStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              
              {activeStep === tutorials[activeTutorial].content.length - 1 ? (
                <Button 
                  onClick={markCompleted}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                  Complete <CheckCircle2 size={16} />
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Tutorials;
