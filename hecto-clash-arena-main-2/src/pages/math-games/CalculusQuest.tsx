
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Code, // Changed from Functions to Code
  Calculator, 
  BarChart, 
  ChevronRight,
  Target,
  Award,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface LessonContent {
  id: string;
  title: string;
  content: string[];
  examples: {
    problem: string;
    solution: string;
    explanation: string;
  }[];
  applications: {
    field: string;
    description: string;
  }[];
}

const CalculusQuest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("derivatives");
  const [activeLevel, setActiveLevel] = useState<string>("beginner");
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lessonProgress, setLessonProgress] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  
  // Lesson content for derivatives
  const derivativesContent: LessonContent = {
    id: "derivatives",
    title: "Derivatives and Rates of Change",
    content: [
      "A derivative measures the rate at which a function changes. It represents the slope of the tangent line to the function at a given point.",
      "The derivative of a function f(x) is denoted as f'(x) or df/dx and is defined as the limit: f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
      "Power Rule: The derivative of x^n is n·x^(n-1). For example, the derivative of x³ is 3x².",
      "Product Rule: The derivative of f(x)·g(x) is f'(x)·g(x) + f(x)·g'(x).",
      "Quotient Rule: The derivative of f(x)/g(x) is [f'(x)·g(x) - f(x)·g'(x)]/[g(x)]².",
      "Chain Rule: The derivative of f(g(x)) is f'(g(x))·g'(x)."
    ],
    examples: [
      {
        problem: "Find the derivative of f(x) = 3x⁴ - 2x² + 5x - 7",
        solution: "f'(x) = 12x³ - 4x + 5",
        explanation: "Apply the power rule to each term: d/dx(3x⁴) = 3·4x³ = 12x³, d/dx(-2x²) = -2·2x = -4x, d/dx(5x) = 5, d/dx(-7) = 0"
      },
      {
        problem: "Find the derivative of g(x) = x²·sin(x)",
        solution: "g'(x) = 2x·sin(x) + x²·cos(x)",
        explanation: "Using the product rule: g'(x) = (x²)'·sin(x) + x²·(sin(x))' = 2x·sin(x) + x²·cos(x)"
      },
      {
        problem: "Find the derivative of h(x) = sin(3x²)",
        solution: "h'(x) = 6x·cos(3x²)",
        explanation: "Using the chain rule: h'(x) = cos(3x²)·d/dx(3x²) = cos(3x²)·6x = 6x·cos(3x²)"
      }
    ],
    applications: [
      {
        field: "Physics",
        description: "Derivatives are used to calculate velocity and acceleration. If s(t) represents position, then v(t) = s'(t) is velocity, and a(t) = v'(t) = s''(t) is acceleration."
      },
      {
        field: "Economics",
        description: "Marginal cost, revenue, and profit are all applications of derivatives. They represent the rate of change of cost, revenue, and profit with respect to quantity."
      },
      {
        field: "Biology",
        description: "Population growth models use derivatives to predict how populations change over time, including logistic growth models where growth is limited by resources."
      },
      {
        field: "Engineering",
        description: "Derivatives help optimize designs by finding maximum efficiencies or minimum costs. They're also used in control systems to predict and stabilize system behavior."
      }
    ]
  };
  
  // Lesson content for integrals
  const integralsContent: LessonContent = {
    id: "integrals",
    title: "Integration and Area Under Curves",
    content: [
      "Integration is the reverse process of differentiation. It finds the accumulation of quantities.",
      "The indefinite integral of f(x) is written as ∫f(x)dx and represents a family of functions whose derivative is f(x).",
      "The indefinite integral of f(x) = x^n is (x^(n+1))/(n+1) + C, where C is the constant of integration.",
      "The definite integral ∫[a,b]f(x)dx calculates the net area between the function and the x-axis from x = a to x = b.",
      "The Fundamental Theorem of Calculus connects differentiation and integration: If F(x) is an antiderivative of f(x), then ∫[a,b]f(x)dx = F(b) - F(a).",
      "Integration techniques include substitution, integration by parts, and partial fractions."
    ],
    examples: [
      {
        problem: "Find ∫(3x² + 2x - 5)dx",
        solution: "∫(3x² + 2x - 5)dx = x³ + x² - 5x + C",
        explanation: "Integrate each term: ∫3x²dx = 3∫x²dx = 3(x³/3) = x³, ∫2xdx = 2(x²/2) = x², ∫(-5)dx = -5x. Add the constant of integration C."
      },
      {
        problem: "Evaluate ∫[0,1]x²dx",
        solution: "∫[0,1]x²dx = [x³/3]₀¹ = 1/3 - 0 = 1/3",
        explanation: "First find the antiderivative: ∫x²dx = x³/3 + C. Then apply the Fundamental Theorem: [x³/3]₀¹ = (1³/3) - (0³/3) = 1/3 - 0 = 1/3"
      },
      {
        problem: "Find ∫sin(x)dx",
        solution: "∫sin(x)dx = -cos(x) + C",
        explanation: "The antiderivative of sin(x) is -cos(x) + C, which you can verify by differentiating: d/dx(-cos(x) + C) = sin(x)"
      }
    ],
    applications: [
      {
        field: "Physics",
        description: "Integrals calculate work done by a force, the center of mass, moments of inertia, and electric and gravitational fields."
      },
      {
        field: "Probability",
        description: "Integration is used to find probabilities in continuous probability distributions, such as the normal distribution."
      },
      {
        field: "Engineering",
        description: "Engineers use integration to calculate the total strain energy in structures, fluid flow rates, and heat transfer through materials."
      },
      {
        field: "Economics",
        description: "Consumer and producer surplus in markets are calculated using integrals, representing the economic benefit to buyers and sellers."
      }
    ]
  };
  
  // Quiz questions for different levels
  const derivativesQuestions: Question[] = [
    {
      id: 1,
      text: "What is the derivative of f(x) = 5x³?",
      options: ["5x²", "15x²", "3x²", "15x³"],
      correctAnswer: 1,
      explanation: "Using the power rule: d/dx(5x³) = 5 · 3 · x²⁻¹ = 15x²",
      difficulty: "Beginner"
    },
    {
      id: 2,
      text: "Find the derivative of f(x) = x² · sin(x)",
      options: ["2x · sin(x)", "x² · cos(x)", "2x · sin(x) + x² · cos(x)", "2x · cos(x)"],
      correctAnswer: 2,
      explanation: "Using the product rule: f'(x) = (x²)' · sin(x) + x² · (sin(x))' = 2x · sin(x) + x² · cos(x)",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      text: "Calculate the second derivative of f(x) = e^x · cos(x)",
      options: ["e^x · cos(x) - e^x · sin(x)", "-e^x · cos(x) - e^x · sin(x)", "-2e^x · sin(x)", "-e^x · cos(x)"],
      correctAnswer: 1,
      explanation: "First derivative: f'(x) = e^x · cos(x) - e^x · sin(x). Second derivative: f''(x) = e^x · cos(x) - e^x · sin(x) - e^x · sin(x) - e^x · cos(x) = -e^x · cos(x) - 2e^x · sin(x)",
      difficulty: "Advanced"
    }
  ];
  
  const integralsQuestions: Question[] = [
    {
      id: 1,
      text: "What is ∫x²dx?",
      options: ["x³/3 + C", "2x + C", "x³ + C", "x² + C"],
      correctAnswer: 0,
      explanation: "Using the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C. For x², we get: ∫x² dx = x³/3 + C",
      difficulty: "Beginner"
    },
    {
      id: 2,
      text: "Evaluate ∫[0,π/2]sin(x)dx",
      options: ["0", "1", "-1", "2"],
      correctAnswer: 1,
      explanation: "∫sin(x)dx = -cos(x) + C. So ∫[0,π/2]sin(x)dx = [-cos(x)]₀^(π/2) = -cos(π/2) - (-cos(0)) = 0 - (-1) = 1",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      text: "Find ∫ln(x)dx",
      options: ["x·ln(x) - x + C", "ln(x)² + C", "x·ln(x) + C", "x·ln(x) + x + C"],
      correctAnswer: 0,
      explanation: "Using integration by parts with u = ln(x) and dv = dx, we get: ∫ln(x)dx = x·ln(x) - ∫x·(1/x)dx = x·ln(x) - ∫dx = x·ln(x) - x + C",
      difficulty: "Advanced"
    }
  ];
  
  const activeContent = activeTab === "derivatives" ? derivativesContent : integralsContent;
  const activeQuestions = activeTab === "derivatives" ? derivativesQuestions : integralsQuestions;
  
  const filteredQuestions = activeQuestions.filter(q => 
    (activeLevel === "beginner" && q.difficulty === "Beginner") ||
    (activeLevel === "intermediate" && q.difficulty === "Intermediate") ||
    (activeLevel === "advanced" && q.difficulty === "Advanced")
  );
  
  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
  };
  
  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };
  
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === filteredQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect. Review the explanation.");
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      toast.success(`Quiz completed! Your score: ${score}/${filteredQuestions.length}`);
      setShowQuiz(false);
      setLessonProgress(100);
    }
  };
  
  const handleContinueLearning = () => {
    const newProgress = Math.min(lessonProgress + 20, 100);
    setLessonProgress(newProgress);
    
    if (newProgress === 100) {
      toast.success("Lesson completed! You can now take the quiz to test your knowledge.");
    }
  };
  
  return (
    <PageLayout
      title="Calculus Quest"
      subtitle="Master derivatives, integrals, and applications of calculus through interactive challenges"
      showProgress
      progressValue={lessonProgress}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setShowQuiz(false);
            setLessonProgress(0);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="derivatives" className="flex items-center gap-2">
              <Code size={18} /> {/* Changed from Functions to Code */}
              Derivatives
            </TabsTrigger>
            <TabsTrigger value="integrals" className="flex items-center gap-2">
              <Calculator size={18} />
              Integrals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="derivatives" className="space-y-6">
            <Card className="p-6 bg-card border-white/10">
              {!showQuiz ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">{activeContent.title}</h2>
                      <p className="text-muted-foreground">Learn about the fundamental concept of derivatives and their applications.</p>
                    </div>
                    <Button 
                      onClick={handleStartQuiz} 
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                      disabled={lessonProgress < 100}
                    >
                      <Target size={16} />
                      Take Quiz
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      Core Concepts
                    </h3>
                    <div className="space-y-4 mb-6">
                      {activeContent.content.map((paragraph, index) => (
                        <p key={index} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calculator size={18} className="text-primary" />
                      Examples
                    </h3>
                    <div className="space-y-4 mb-6">
                      {activeContent.examples.map((example, index) => (
                        <Card key={index} className="p-4 bg-muted/30 border-white/10">
                          <h4 className="font-medium mb-2">Problem {index + 1}:</h4>
                          <p className="mb-3">{example.problem}</p>
                          <div className="bg-primary/10 p-3 rounded-md mb-2">
                            <p className="font-semibold">Solution: {example.solution}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{example.explanation}</p>
                        </Card>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BarChart size={18} className="text-primary" />
                      Real-World Applications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {activeContent.applications.map((app, index) => (
                        <Card key={index} className="p-4 bg-muted/30 border-white/10">
                          <h4 className="font-medium text-primary mb-1">{app.field}</h4>
                          <p className="text-sm">{app.description}</p>
                        </Card>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleContinueLearning} 
                      className="w-full mt-4 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                      disabled={lessonProgress >= 100}
                    >
                      Continue Learning
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">Derivatives Quiz</h2>
                      <p className="text-muted-foreground">Test your knowledge of derivatives with these questions.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowQuiz(false)}
                      className="border-white/10 hover:bg-primary/20"
                    >
                      Back to Lesson
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Tabs
                      value={activeLevel}
                      onValueChange={setActiveLevel}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 w-full mb-4">
                        <TabsTrigger value="beginner">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {filteredQuestions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                          <span>Score: {score}/{filteredQuestions.length}</span>
                        </div>
                        
                        <Card className="p-4 bg-muted/20 border-white/10">
                          <h3 className="text-lg font-medium mb-4">{filteredQuestions[currentQuestion].text}</h3>
                          
                          <div className="grid grid-cols-1 gap-3 mb-4">
                            {filteredQuestions[currentQuestion].options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className={`justify-start text-left h-auto py-3 ${
                                  selectedAnswer === index ? "border-primary bg-primary/20" : "border-white/10"
                                } ${
                                  showExplanation && index === filteredQuestions[currentQuestion].correctAnswer
                                    ? "border-green-500 bg-green-500/20"
                                    : ""
                                } ${
                                  showExplanation && selectedAnswer === index && 
                                  index !== filteredQuestions[currentQuestion].correctAnswer
                                    ? "border-red-500 bg-red-500/20"
                                    : ""
                                }`}
                                onClick={() => handleSelectAnswer(index)}
                              >
                                {showExplanation && index === filteredQuestions[currentQuestion].correctAnswer && (
                                  <CheckCircle size={16} className="mr-2 text-green-500" />
                                )}
                                {option}
                              </Button>
                            ))}
                          </div>
                          
                          {!showExplanation ? (
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={handleCheckAnswer}
                              disabled={selectedAnswer === null}
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 bg-muted rounded-md border border-white/10">
                                <h4 className="font-medium mb-2">Explanation:</h4>
                                <p>{filteredQuestions[currentQuestion].explanation}</p>
                              </div>
                              
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleNextQuestion}
                              >
                                {currentQuestion < filteredQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
                              </Button>
                            </div>
                          )}
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p>No questions available for this difficulty level. Please select another level.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="integrals" className="space-y-6">
            <Card className="p-6 bg-card border-white/10">
              {!showQuiz ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">{activeContent.title}</h2>
                      <p className="text-muted-foreground">Learn about integration, the fundamental theorem of calculus, and applications.</p>
                    </div>
                    <Button 
                      onClick={handleStartQuiz} 
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                      disabled={lessonProgress < 100}
                    >
                      <Target size={16} />
                      Take Quiz
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      Core Concepts
                    </h3>
                    <div className="space-y-4 mb-6">
                      {activeContent.content.map((paragraph, index) => (
                        <p key={index} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calculator size={18} className="text-primary" />
                      Examples
                    </h3>
                    <div className="space-y-4 mb-6">
                      {activeContent.examples.map((example, index) => (
                        <Card key={index} className="p-4 bg-muted/30 border-white/10">
                          <h4 className="font-medium mb-2">Problem {index + 1}:</h4>
                          <p className="mb-3">{example.problem}</p>
                          <div className="bg-primary/10 p-3 rounded-md mb-2">
                            <p className="font-semibold">Solution: {example.solution}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{example.explanation}</p>
                        </Card>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BarChart size={18} className="text-primary" />
                      Real-World Applications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {activeContent.applications.map((app, index) => (
                        <Card key={index} className="p-4 bg-muted/30 border-white/10">
                          <h4 className="font-medium text-primary mb-1">{app.field}</h4>
                          <p className="text-sm">{app.description}</p>
                        </Card>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleContinueLearning} 
                      className="w-full mt-4 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                      disabled={lessonProgress >= 100}
                    >
                      Continue Learning
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-2">Integrals Quiz</h2>
                      <p className="text-muted-foreground">Test your knowledge of integration with these questions.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowQuiz(false)}
                      className="border-white/10 hover:bg-primary/20"
                    >
                      Back to Lesson
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Tabs
                      value={activeLevel}
                      onValueChange={setActiveLevel}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 w-full mb-4">
                        <TabsTrigger value="beginner">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {filteredQuestions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                          <span>Score: {score}/{filteredQuestions.length}</span>
                        </div>
                        
                        <Card className="p-4 bg-muted/20 border-white/10">
                          <h3 className="text-lg font-medium mb-4">{filteredQuestions[currentQuestion].text}</h3>
                          
                          <div className="grid grid-cols-1 gap-3 mb-4">
                            {filteredQuestions[currentQuestion].options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className={`justify-start text-left h-auto py-3 ${
                                  selectedAnswer === index ? "border-primary bg-primary/20" : "border-white/10"
                                } ${
                                  showExplanation && index === filteredQuestions[currentQuestion].correctAnswer
                                    ? "border-green-500 bg-green-500/20"
                                    : ""
                                } ${
                                  showExplanation && selectedAnswer === index && 
                                  index !== filteredQuestions[currentQuestion].correctAnswer
                                    ? "border-red-500 bg-red-500/20"
                                    : ""
                                }`}
                                onClick={() => handleSelectAnswer(index)}
                              >
                                {showExplanation && index === filteredQuestions[currentQuestion].correctAnswer && (
                                  <CheckCircle size={16} className="mr-2 text-green-500" />
                                )}
                                {option}
                              </Button>
                            ))}
                          </div>
                          
                          {!showExplanation ? (
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={handleCheckAnswer}
                              disabled={selectedAnswer === null}
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 bg-muted rounded-md border border-white/10">
                                <h4 className="font-medium mb-2">Explanation:</h4>
                                <p>{filteredQuestions[currentQuestion].explanation}</p>
                              </div>
                              
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleNextQuestion}
                              >
                                {currentQuestion < filteredQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
                              </Button>
                            </div>
                          )}
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p>No questions available for this difficulty level. Please select another level.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-6 bg-gradient-to-r from-red-900/20 to-black border-white/10">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Award size={20} className="text-primary" />
            Why Learn Calculus?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Career Opportunities</h4>
              <p className="text-sm">Calculus is essential for careers in engineering, physics, computer science, economics, medicine, and many other STEM fields.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Problem-Solving Skills</h4>
              <p className="text-sm">Learning calculus develops critical thinking and analytical reasoning abilities that are valuable in any career path.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Understanding Our World</h4>
              <p className="text-sm">Calculus helps us understand how things change and provides tools to model natural phenomena, from planetary motion to population growth.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Foundation for Advanced Math</h4>
              <p className="text-sm">Calculus is the gateway to more advanced mathematical fields like differential equations, complex analysis, and topology.</p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CalculusQuest;
