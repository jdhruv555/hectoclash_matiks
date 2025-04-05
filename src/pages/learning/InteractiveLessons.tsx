import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, ArrowRight, CheckCircle, XCircle, RotateCcw, Youtube, BookOpen } from "lucide-react";
import { toast } from "sonner";
import VideoLectureGallery from "@/components/VideoLectureGallery";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string[];
  questions: Question[];
}

const mathVideos = [
  {
    id: "v1",
    title: "Introduction to Calculus - The Language of Change",
    channel: "3Blue1Brown",
    thumbnail: "https://i.ytimg.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    duration: "17:04",
    views: "8.4M",
    likes: "236K",
    url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    description: "A visual introduction to calculus. Covers basic concepts of derivatives, integrals, and the fundamental theorem of calculus.",
    category: "Calculus",
    difficulty: "Beginner" as const
  },
  {
    id: "v2",
    title: "Linear Algebra Done Right - Essence of Linear Algebra",
    channel: "3Blue1Brown",
    thumbnail: "https://i.ytimg.com/vi/fNk_zzaMoSs/maxresdefault.jpg",
    duration: "15:49",
    views: "5.2M",
    likes: "189K",
    url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
    description: "Visual understanding of linear algebra concepts - vectors, basis, linear transformations, and more.",
    category: "Linear Algebra",
    difficulty: "Intermediate" as const
  },
  {
    id: "v3",
    title: "The Map of Mathematics",
    channel: "Domain of Science",
    thumbnail: "https://i.ytimg.com/vi/OmJ-4B-mS-Y/maxresdefault.jpg",
    duration: "11:05",
    views: "10.1M",
    likes: "309K",
    url: "https://www.youtube.com/watch?v=OmJ-4B-mS-Y",
    description: "An overview of the entire field of mathematics, showing how different branches are related.",
    category: "Overview",
    difficulty: "Beginner" as const
  },
  {
    id: "v4",
    title: "Euler's Identity: The Most Beautiful Equation",
    channel: "Numberphile",
    thumbnail: "https://i.ytimg.com/vi/sKtloBAuP74/maxresdefault.jpg",
    duration: "14:43",
    views: "3.7M",
    likes: "105K",
    url: "https://www.youtube.com/watch?v=sKtloBAuP74",
    description: "Deep dive into the elegant mathematical equation that connects five fundamental constants.",
    category: "Complex Analysis",
    difficulty: "Advanced" as const
  },
  {
    id: "v5",
    title: "Fast Mental Multiplication Tricks - Multiply Numbers In Your Head",
    channel: "MindYourDecisions",
    thumbnail: "https://i.ytimg.com/vi/YOO3kNZ7hJw/maxresdefault.jpg",
    duration: "8:32",
    views: "2.5M",
    likes: "90K",
    url: "https://www.youtube.com/watch?v=YOO3kNZ7hJw",
    description: "Learn techniques to multiply large numbers quickly in your head without a calculator.",
    category: "Mental Math",
    difficulty: "Beginner" as const
  },
  {
    id: "v6",
    title: "Understanding Four Dimensional Space",
    channel: "PBS Infinite Series",
    thumbnail: "https://i.ytimg.com/vi/zwAD6dRSVyI/maxresdefault.jpg",
    duration: "12:57",
    views: "1.8M",
    likes: "65K",
    url: "https://www.youtube.com/watch?v=zwAD6dRSVyI",
    description: "How to visualize and understand four-dimensional geometry and hypercubes.",
    category: "Geometry",
    difficulty: "Advanced" as const
  }
];

const InteractiveLessons: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<string>("fractions");
  const [step, setStep] = useState<"content" | "quiz">("content");
  const [contentIndex, setContentIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activePage, setActivePage] = useState<"lessons" | "videos">("lessons");
  
  const lessons: Record<string, Lesson> = {
    "fractions": {
      id: "fractions",
      title: "Understanding Fractions",
      description: "Learn how to work with parts of a whole and perform operations with fractions",
      content: [
        "A fraction represents a part of a whole. The top number (numerator) represents how many parts we have, and the bottom number (denominator) represents the total number of equal parts the whole is divided into.",
        "To add or subtract fractions with the same denominator, simply add or subtract the numerators while keeping the denominator the same: a/c + b/c = (a+b)/c",
        "To add or subtract fractions with different denominators, first find a common denominator. Then convert each fraction to an equivalent fraction with that common denominator.",
        "To multiply fractions, multiply the numerators together and the denominators together: a/b × c/d = (a×c)/(b×d)",
        "To divide by a fraction, multiply by its reciprocal: a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)"
      ],
      questions: [
        {
          id: 1,
          text: "What is 2/3 + 1/3?",
          options: ["1", "3/3", "3/6", "2/6"],
          correctAnswer: 0,
          explanation: "When adding fractions with the same denominator, add the numerators while keeping the denominator the same: 2/3 + 1/3 = 3/3 = 1"
        },
        {
          id: 2,
          text: "What is 1/4 + 2/3?",
          options: ["3/7", "3/12", "11/12", "5/12"],
          correctAnswer: 2,
          explanation: "To add fractions with different denominators, first find a common denominator: LCD of 4 and 3 is 12. Convert 1/4 to 3/12 and 2/3 to 8/12. Then add: 3/12 + 8/12 = 11/12"
        },
        {
          id: 3,
          text: "What is 2/5 × 3/4?",
          options: ["6/20", "5/9", "6/9", "3/10"],
          correctAnswer: 0,
          explanation: "To multiply fractions, multiply the numerators and denominators: 2/5 × 3/4 = (2×3)/(5×4) = 6/20 = 3/10 when simplified"
        }
      ]
    },
    "algebra": {
      id: "algebra",
      title: "Introduction to Algebra",
      description: "Learn about variables, expressions, and solving basic algebraic equations",
      content: [
        "Algebra is a branch of mathematics that uses symbols, usually letters, to represent numbers and quantities in formulas and equations.",
        "A variable is a symbol that represents an unknown value. In algebra, we often use letters like x, y, and z as variables.",
        "An algebraic expression is a combination of variables, numbers, and operations. Examples include 3x + 2 and x² - 5x + 6.",
        "An equation is a statement that two expressions are equal. For example, 2x + 3 = 11 is an equation.",
        "To solve a linear equation, isolate the variable on one side of the equation by performing the same operations on both sides."
      ],
      questions: [
        {
          id: 1,
          text: "What is the value of x in the equation 3x + 7 = 22?",
          options: ["5", "8", "15", "29"],
          correctAnswer: 0,
          explanation: "To solve for x: 3x + 7 = 22\n3x = 22 - 7\n3x = 15\nx = 15 ÷ 3\nx = 5"
        },
        {
          id: 2,
          text: "Which expression equals 2x² when x = 3?",
          options: ["6", "9", "12", "18"],
          correctAnswer: 3,
          explanation: "When x = 3, 2x² = 2 × 3² = 2 × 9 = 18"
        },
        {
          id: 3,
          text: "What is the solution to 2(x - 4) = x + 6?",
          options: ["14", "10", "7", "2"],
          correctAnswer: 1,
          explanation: "2(x - 4) = x + 6\n2x - 8 = x + 6\n2x - x = 6 + 8\nx = 14"
        }
      ]
    },
    "geometry": {
      id: "geometry",
      title: "Geometry Basics",
      description: "Explore shapes, angles, and spatial relationships",
      content: [
        "Geometry is the branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids.",
        "Angles are measured in degrees. A full circle is 360 degrees. A right angle is 90 degrees.",
        "Triangles are polygons with three sides. The sum of angles in any triangle is 180 degrees.",
        "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides: a² + b² = c².",
        "The area of a triangle is A = (1/2) × base × height. The area of a rectangle is A = length × width."
      ],
      questions: [
        {
          id: 1,
          text: "What is the area of a rectangle with length 8 cm and width 5 cm?",
          options: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"],
          correctAnswer: 2,
          explanation: "The area of a rectangle is length × width = 8 cm × 5 cm = 40 cm²"
        },
        {
          id: 2,
          text: "In a right triangle, if the two shorter sides are 6 cm and 8 cm, what is the length of the hypotenuse?",
          options: ["10 cm", "14 cm", "12 cm", "9 cm"],
          correctAnswer: 0,
          explanation: "Using the Pythagorean theorem: a² + b² = c²\n6² + 8² = c²\n36 + 64 = c²\n100 = c²\nc = 10 cm"
        },
        {
          id: 3,
          text: "What is the sum of the interior angles in a pentagon (5-sided polygon)?",
          options: ["360°", "540°", "720°", "900°"],
          correctAnswer: 1,
          explanation: "For any n-sided polygon, the sum of interior angles is (n - 2) × 180°. For a pentagon, n = 5, so the sum is (5 - 2) × 180° = 3 × 180° = 540°"
        }
      ]
    },
    "calculus": {
      id: "calculus",
      title: "Introduction to Calculus",
      description: "Learn the fundamentals of differential and integral calculus",
      content: [
        "Calculus is the mathematical study of continuous change, divided primarily into differential calculus and integral calculus.",
        "The derivative of a function represents its rate of change. Geometrically, it's the slope of the tangent line at a point on the graph.",
        "Derivatives are calculated using limits. The derivative of f(x) is defined as: f'(x) = lim(h→0) [f(x+h) - f(x)]/h.",
        "Integration is the reverse process of differentiation. It finds the accumulation of quantities, like area under a curve.",
        "The Fundamental Theorem of Calculus connects differentiation and integration, stating that if F(x) is an antiderivative of f(x), then ∫[a,b] f(x) dx = F(b) - F(a)."
      ],
      questions: [
        {
          id: 1,
          text: "What is the derivative of f(x) = x²?",
          options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
          correctAnswer: 1,
          explanation: "The power rule states that if f(x) = xⁿ, then f'(x) = n×xⁿ⁻¹. For f(x) = x², n = 2, so f'(x) = 2×x²⁻¹ = 2x."
        },
        {
          id: 2,
          text: "What is ∫x dx?",
          options: ["x", "x² + C", "x²/2 + C", "ln|x| + C"],
          correctAnswer: 2,
          explanation: "The power rule for integration states that ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. For ∫x dx, n = 1, so ∫x dx = x²/2 + C."
        },
        {
          id: 3,
          text: "Which of the following is the second derivative of f(x) = 3x³ - 2x² + 4x - 1?",
          options: ["f''(x) = 9x² - 4x + 4", "f''(x) = 18x - 4", "f''(x) = 18", "f''(x) = 18x - 4x"],
          correctAnswer: 1,
          explanation: "First derivative: f'(x) = 9x² - 4x + 4\nSecond derivative: f''(x) = 18x - 4"
        }
      ]
    }
  };
  
  const currentLesson = lessons[activeLesson];
  
  const handleNextContent = () => {
    if (contentIndex < currentLesson.content.length - 1) {
      setContentIndex(contentIndex + 1);
    } else {
      // Move to quiz
      setStep("quiz");
      setQuizIndex(0);
      setCorrectAnswers(0);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };
  
  const handlePrevContent = () => {
    if (contentIndex > 0) {
      setContentIndex(contentIndex - 1);
    }
  };
  
  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };
  
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentLesson.questions[quizIndex].correctAnswer;
    setShowExplanation(true);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect. Review the explanation.");
    }
  };
  
  const handleNextQuestion = () => {
    if (quizIndex < currentLesson.questions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Completed the quiz
      const passScore = Math.ceil(currentLesson.questions.length * 0.7);
      const passed = correctAnswers >= passScore;
      
      if (passed && !completedLessons.includes(activeLesson)) {
        setCompletedLessons([...completedLessons, activeLesson]);
      }
      
      toast[passed ? "success" : "error"](
        passed 
          ? `Lesson completed! You scored ${correctAnswers}/${currentLesson.questions.length}` 
          : `You scored ${correctAnswers}/${currentLesson.questions.length}. Try again to complete the lesson.`
      );
      
      // Reset for next lesson
      setStep("content");
      setContentIndex(0);
    }
  };
  
  const resetLesson = () => {
    setStep("content");
    setContentIndex(0);
    setQuizIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
  };
  
  return (
    <PageLayout 
      title="Interactive Learning" 
      subtitle="Engage with lessons, videos and test your understanding"
      showProgress
      progressValue={(completedLessons.length / Object.keys(lessons).length) * 100}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Tabs 
          value={activePage} 
          onValueChange={(value) => setActivePage(value as "lessons" | "videos")}
          className="mb-6"
        >
          <TabsList className="mb-4 bg-muted shadow-lg">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen size={16} />
              Interactive Lessons
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Youtube size={16} />
              Video Lectures
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons">
            <Tabs 
              value={activeLesson} 
              onValueChange={(value) => {
                setActiveLesson(value);
                resetLesson();
              }}
              className="mb-6"
            >
              <TabsList className="mb-4 gap-1 bg-muted/70">
                {Object.values(lessons).map(lesson => (
                  <TabsTrigger key={lesson.id} value={lesson.id} className="relative px-5">
                    {lesson.title}
                    {completedLessons.includes(lesson.id) && (
                      <span className="absolute -top-1 -right-1">
                        <CheckCircle size={16} className="text-green-600 fill-white" />
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        
            <Card className="p-6 bg-card backdrop-blur-sm mb-6 border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{currentLesson.title}</h2>
                  <p className="text-muted-foreground">{currentLesson.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetLesson} className="flex items-center gap-1 border-white/20 hover:bg-white/5">
                  <RotateCcw size={14} />
                  Reset
                </Button>
              </div>
              
              <div className="mb-4">
                <Progress 
                  value={step === "content" 
                    ? ((contentIndex + 1) / currentLesson.content.length) * 100
                    : ((quizIndex + 1) / currentLesson.questions.length) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{step === "content" ? "Learning content" : "Quiz"}</span>
                  <span>
                    {step === "content" 
                      ? `${contentIndex + 1}/${currentLesson.content.length}` 
                      : `${quizIndex + 1}/${currentLesson.questions.length}`}
                  </span>
                </div>
              </div>
              
              {step === "content" ? (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-5 rounded-lg border border-primary/10 min-h-[200px]">
                    <p>{currentLesson.content[contentIndex]}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevContent}
                      disabled={contentIndex === 0}
                      className="border-white/20 hover:bg-white/5"
                    >
                      Previous
                    </Button>
                    <Button onClick={handleNextContent} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1">
                      {contentIndex < currentLesson.content.length - 1 ? 'Next' : 'Start Quiz'}
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Question {quizIndex + 1}: {currentLesson.questions[quizIndex].text}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {currentLesson.questions[quizIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedOption === index ? "default" : "outline"}
                          className={`justify-start text-left h-auto py-3 ${
                            showExplanation 
                              ? index === currentLesson.questions[quizIndex].correctAnswer
                                ? "bg-green-900/20 hover:bg-green-900/30 text-green-300 border-green-700" 
                                : selectedOption === index
                                ? "bg-red-900/20 hover:bg-red-900/30 text-red-300 border-red-700"
                                : "border-white/20 hover:bg-white/5"
                              : "border-white/20 hover:bg-white/5"
                          }`}
                          onClick={() => !showExplanation && handleSelectOption(index)}
                          disabled={showExplanation}
                        >
                          {showExplanation && index === currentLesson.questions[quizIndex].correctAnswer && (
                            <CheckCircle size={16} className="mr-2 text-green-600" />
                          )}
                          {showExplanation && selectedOption === index && index !== currentLesson.questions[quizIndex].correctAnswer && (
                            <XCircle size={16} className="mr-2 text-red-600" />
                          )}
                          {option}
                        </Button>
                      ))}
                    </div>
                    
                    {!showExplanation ? (
                      <Button 
                        onClick={handleCheckAnswer}
                        disabled={selectedOption === null}
                        className="w-full py-2 bg-primary hover:bg-primary/90 text-white"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <>
                        <div className="bg-muted/50 p-4 rounded-lg mb-4 border border-white/10">
                          <h4 className="font-medium mb-1">Explanation:</h4>
                          <p className="text-sm whitespace-pre-line">{currentLesson.questions[quizIndex].explanation}</p>
                        </div>
                        <Button 
                          onClick={handleNextQuestion}
                          className="w-full py-2 bg-primary hover:bg-primary/90 text-white"
                        >
                          {quizIndex < currentLesson.questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="space-y-6">
              <Card className="p-6 bg-card border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-primary">Video Math Lectures</h2>
                <p className="text-muted-foreground mb-6">
                  Watch high-quality lectures from top math educators to deepen your understanding of complex mathematical concepts.
                </p>
                
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="mb-4 bg-muted/70">
                    <TabsTrigger value="all">All Topics</TabsTrigger>
                    <TabsTrigger value="calculus">Calculus</TabsTrigger>
                    <TabsTrigger value="algebra">Algebra</TabsTrigger>
                    <TabsTrigger value="geometry">Geometry</TabsTrigger>
                    <TabsTrigger value="mental">Mental Math</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <VideoLectureGallery videos={mathVideos} />
                  </TabsContent>
                  
                  <TabsContent value="calculus">
                    <VideoLectureGallery 
                      videos={mathVideos.filter(v => v.category === "Calculus" || v.category === "Complex Analysis")} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="algebra">
                    <VideoLectureGallery 
                      videos={mathVideos.filter(v => v.category === "Linear Algebra" || v.category === "Algebra")} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="geometry">
                    <VideoLectureGallery 
                      videos={mathVideos.filter(v => v.category === "Geometry")} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="mental">
                    <VideoLectureGallery 
                      videos={mathVideos.filter(v => v.category === "Mental Math")} 
                    />
                  </TabsContent>
                </Tabs>
              </Card>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-red-900/20 to-black/20 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold mb-2">Benefits of Video Learning</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary mt-1" />
                    <span>Visual explanations make abstract concepts more concrete and easier to understand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary mt-1" />
                    <span>Learn at your own pace - pause, rewind, and rewatch as needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary mt-1" />
                    <span>Diverse teaching styles help reinforce concepts from different perspectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary mt-1" />
                    <span>Supplement traditional learning with engaging explanations by expert educators</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default InteractiveLessons;
