
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  CheckCircle,
  XCircle,
  ChevronRight,
  Star,
  Compass,
  Trophy,
  Calculator 
} from "lucide-react";
import { toast } from "sonner";

interface GeometryQuestion {
  id: number;
  text: string;
  figure?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const GeometryDash: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("2d");
  const [activeLevel, setActiveLevel] = useState<string>("beginner");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  // 2D Geometry content
  const geometry2DContent = [
    {
      title: "Points and Lines",
      description: "Points have position but no size. Lines extend infinitely in both directions. Line segments have two endpoints. Rays have one endpoint and extend infinitely in one direction.",
      examples: ["Distance formula between points: d = √[(x₂ - x₁)² + (y₂ - y₁)²]", "Slope of a line: m = (y₂ - y₁) / (x₂ - x₁)", "Equation of a line: y = mx + b"]
    },
    {
      title: "Angles",
      description: "Angles measure the amount of rotation between two rays. Complementary angles sum to 90°. Supplementary angles sum to 180°. Vertical angles are equal.",
      examples: ["Acute angle: < 90°", "Right angle: = 90°", "Obtuse angle: > 90° and < 180°", "Straight angle: = 180°"]
    },
    {
      title: "Triangles",
      description: "A triangle has three sides and three angles. The sum of angles in a triangle is 180°. Types include equilateral, isosceles, scalene, right, acute, and obtuse triangles.",
      examples: ["Area = (1/2) × base × height", "Perimeter = sum of all sides", "Pythagorean theorem: a² + b² = c² (in right triangles)"]
    },
    {
      title: "Quadrilaterals",
      description: "Four-sided polygons include squares, rectangles, rhombuses, parallelograms, trapezoids, and kites. Each has unique properties related to sides, angles, and diagonals.",
      examples: ["Square: All sides equal, all angles 90°", "Rectangle: Opposite sides equal, all angles 90°", "Rhombus: All sides equal, opposite angles equal"]
    },
    {
      title: "Circles",
      description: "A circle is a set of all points equidistant from a center point. Key parts include radius, diameter, chord, arc, sector, and segment.",
      examples: ["Circumference = 2πr", "Area = πr²", "Arc length = (θ/360°) × 2πr", "Sector area = (θ/360°) × πr²"]
    }
  ];
  
  // 3D Geometry content
  const geometry3DContent = [
    {
      title: "Points, Lines, and Planes in 3D",
      description: "In 3D space, points have three coordinates (x, y, z). Lines can be represented by parametric equations. Planes are determined by three non-collinear points or a point and a normal vector.",
      examples: ["Distance formula in 3D: d = √[(x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²]", "Plane equation: ax + by + cz + d = 0"]
    },
    {
      title: "Polyhedra",
      description: "Polyhedra are 3D shapes with flat faces, straight edges, and vertices. Regular polyhedra (Platonic solids) include tetrahedron, cube, octahedron, dodecahedron, and icosahedron.",
      examples: ["Faces + Vertices - Edges = 2 (Euler's formula)", "Cube: 6 faces, 8 vertices, 12 edges", "Tetrahedron: 4 faces, 4 vertices, 6 edges"]
    },
    {
      title: "Prisms and Pyramids",
      description: "Prisms have two congruent, parallel faces (bases) and rectangular lateral faces. Pyramids have one base and triangular lateral faces that meet at a vertex (apex).",
      examples: ["Volume of prism = base area × height", "Volume of pyramid = (1/3) × base area × height"]
    },
    {
      title: "Cylinders, Cones, and Spheres",
      description: "Cylinders have two parallel circular bases and a curved lateral surface. Cones have one circular base and a curved lateral surface that tapers to a point. Spheres are sets of all points equidistant from a center point.",
      examples: ["Cylinder volume = πr²h", "Cone volume = (1/3) × πr²h", "Sphere volume = (4/3) × πr³"]
    },
    {
      title: "Coordinate Geometry in 3D",
      description: "3D coordinate geometry extends 2D concepts to space. It involves vectors, dot products, cross products, and equations of lines and planes.",
      examples: ["Dot product: a·b = |a||b|cos(θ)", "Cross product: a×b = |a||b|sin(θ)n", "Vector magnitude: |v| = √(x² + y² + z²)"]
    }
  ];
  
  // Geometry questions for 2D
  const geometry2DQuestions: GeometryQuestion[] = [
    {
      id: 1,
      text: "What is the area of a circle with radius 5 units?",
      options: ["10π square units", "25π square units", "50π square units", "100π square units"],
      correctAnswer: 1,
      explanation: "The area of a circle is given by A = πr². When r = 5, A = π × 5² = 25π square units.",
      difficulty: "Beginner"
    },
    {
      id: 2,
      text: "In a right triangle, if one angle is 30° and the hypotenuse is 10 cm, what is the length of the side opposite to the 30° angle?",
      options: ["5 cm", "10 cm", "5√3 cm", "5√2 cm"],
      correctAnswer: 0,
      explanation: "In a right triangle, the side opposite to a 30° angle is equal to (hypotenuse × sin(30°)). Sin(30°) = 0.5, so the side length is 10 × 0.5 = 5 cm.",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      text: "What is the equation of a circle with center at (3, -2) and radius 4?",
      options: ["(x - 3)² + (y + 2)² = 16", "(x + 3)² + (y - 2)² = 16", "(x - 3)² + (y - 2)² = 16", "(x + 3)² + (y + 2)² = 16"],
      correctAnswer: 0,
      explanation: "The equation of a circle with center (h, k) and radius r is (x - h)² + (y - k)² = r². With center (3, -2) and radius 4, we get (x - 3)² + (y - (-2))² = 4², which simplifies to (x - 3)² + (y + 2)² = 16.",
      difficulty: "Advanced"
    }
  ];
  
  // Geometry questions for 3D
  const geometry3DQuestions: GeometryQuestion[] = [
    {
      id: 1,
      text: "What is the volume of a cube with side length 3 units?",
      options: ["9 cubic units", "18 cubic units", "27 cubic units", "81 cubic units"],
      correctAnswer: 2,
      explanation: "The volume of a cube is given by V = s³, where s is the side length. When s = 3, V = 3³ = 27 cubic units.",
      difficulty: "Beginner"
    },
    {
      id: 2,
      text: "What is the surface area of a sphere with radius 4 units?",
      options: ["16π square units", "64π square units", "48π square units", "256π square units"],
      correctAnswer: 1,
      explanation: "The surface area of a sphere is given by A = 4πr². When r = 4, A = 4π × 4² = 64π square units.",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      text: "In a regular tetrahedron with edge length 6 units, what is the height (distance from any vertex to the opposite face)?",
      options: ["6√2 units", "6√(2/3) units", "6√(3/2) units", "6√3 units"],
      correctAnswer: 2,
      explanation: "The height of a regular tetrahedron with edge length a is h = a × √(6)/3. When a = 6, h = 6 × √(6)/3 = 6 × √(6/3) = 6√(2/3) units.",
      difficulty: "Advanced"
    }
  ];
  
  const activeContent = activeTab === "2d" ? geometry2DContent : geometry3DContent;
  const activeQuestions = activeTab === "2d" ? geometry2DQuestions : geometry3DQuestions;
  
  const filteredQuestions = activeQuestions.filter(q => 
    (activeLevel === "beginner" && q.difficulty === "Beginner") ||
    (activeLevel === "intermediate" && q.difficulty === "Intermediate") ||
    (activeLevel === "advanced" && q.difficulty === "Advanced")
  );
  
  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };
  
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === filteredQuestions[questionIndex].correctAnswer) {
      setScore(score + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect. Review the explanation.");
    }
  };
  
  const handleNextQuestion = () => {
    if (questionIndex < filteredQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      toast.success(`Quiz completed! Your score: ${score}/${filteredQuestions.length}`);
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setProgress(Math.min(progress + 25, 100));
    }
  };
  
  const handleContinueLearning = () => {
    const newProgress = Math.min(progress + 20, 100);
    setProgress(newProgress);
    
    if (newProgress === 100) {
      toast.success("You've completed this geometry module! Try a quiz to test your knowledge.");
    }
  };
  
  return (
    <PageLayout
      title="Geometry Dash"
      subtitle="Explore the fascinating world of shapes, spaces, and measurements"
      showProgress
      progressValue={progress}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setQuestionIndex(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setScore(0);
            setProgress(0);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <Square size={18} />
              2D Geometry
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Cube size={18} />
              3D Geometry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="2d" className="space-y-6">
            <Card className="p-6 bg-card border-white/10">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">2D Geometry Concepts</h2>
                    <p className="text-muted-foreground">Explore the properties of two-dimensional shapes and their applications.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setActiveLevel("beginner");
                      setQuestionIndex(0);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                      setScore(0);
                    }} 
                    className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Calculator size={16} />
                    Take a Quiz
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {activeContent.map((section, index) => (
                    <Card key={index} className="p-4 bg-muted/20 border-white/10 hover:border-primary/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/20 text-primary">
                          {index === 0 ? <Compass size={20} /> : 
                           index === 1 ? <Triangle size={20} /> : 
                           index === 2 ? <Triangle size={20} /> :
                           index === 3 ? <Square size={20} /> : 
                           <Circle size={20} />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                          <p className="mb-3 text-sm text-muted-foreground">{section.description}</p>
                          
                          <div className="bg-black/40 p-3 rounded-md mb-2">
                            <h4 className="text-sm font-medium mb-2 text-primary">Key Formulas:</h4>
                            <ul className="space-y-1">
                              {section.examples.map((example, idx) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button variant="outline" className="mt-2 border-white/10 hover:bg-primary/20">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  onClick={handleContinueLearning} 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  Continue Learning
                  <ChevronRight size={16} />
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 bg-card border-white/10">
              <h3 className="text-lg font-bold mb-4">Geometry Quiz</h3>
              
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
                      <span>Question {questionIndex + 1} of {filteredQuestions.length}</span>
                      <span>Score: {score}/{filteredQuestions.length}</span>
                    </div>
                    
                    <Card className="p-4 bg-muted/20 border-white/10">
                      <h3 className="text-lg font-medium mb-4">{filteredQuestions[questionIndex].text}</h3>
                      
                      {filteredQuestions[questionIndex].figure && (
                        <div className="mb-4 p-4 bg-muted/30 flex justify-center">
                          <img src={filteredQuestions[questionIndex].figure} alt="Geometry figure" className="max-h-48" />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        {filteredQuestions[questionIndex].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className={`justify-start text-left h-auto py-3 ${
                              selectedAnswer === index ? "border-primary bg-primary/20" : "border-white/10"
                            } ${
                              showExplanation && index === filteredQuestions[questionIndex].correctAnswer
                                ? "border-green-500 bg-green-500/20"
                                : ""
                            } ${
                              showExplanation && selectedAnswer === index && 
                              index !== filteredQuestions[questionIndex].correctAnswer
                                ? "border-red-500 bg-red-500/20"
                                : ""
                            }`}
                            onClick={() => handleSelectAnswer(index)}
                          >
                            {showExplanation && index === filteredQuestions[questionIndex].correctAnswer && (
                              <CheckCircle size={16} className="mr-2 text-green-500" />
                            )}
                            {showExplanation && selectedAnswer === index && 
                              index !== filteredQuestions[questionIndex].correctAnswer && (
                              <XCircle size={16} className="mr-2 text-red-500" />
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
                            <p>{filteredQuestions[questionIndex].explanation}</p>
                          </div>
                          
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={handleNextQuestion}
                          >
                            {questionIndex < filteredQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
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
            </Card>
          </TabsContent>
          
          <TabsContent value="3d" className="space-y-6">
            <Card className="p-6 bg-card border-white/10">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">3D Geometry Concepts</h2>
                    <p className="text-muted-foreground">Explore three-dimensional shapes, volumes, and spatial relationships.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setActiveLevel("beginner");
                      setQuestionIndex(0);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                      setScore(0);
                    }} 
                    className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Calculator size={16} />
                    Take a Quiz
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {activeContent.map((section, index) => (
                    <Card key={index} className="p-4 bg-muted/20 border-white/10 hover:border-primary/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/20 text-primary">
                          {index === 0 ? <Compass size={20} /> : 
                           index === 1 ? <Cube size={20} /> : 
                           index === 2 ? <Triangle size={20} /> :
                           index === 3 ? <Circle size={20} /> : 
                           <Calculator size={20} />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                          <p className="mb-3 text-sm text-muted-foreground">{section.description}</p>
                          
                          <div className="bg-black/40 p-3 rounded-md mb-2">
                            <h4 className="text-sm font-medium mb-2 text-primary">Key Formulas:</h4>
                            <ul className="space-y-1">
                              {section.examples.map((example, idx) => (
                                <li key={idx} className="text-sm flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button variant="outline" className="mt-2 border-white/10 hover:bg-primary/20">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  onClick={handleContinueLearning} 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  Continue Learning
                  <ChevronRight size={16} />
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 bg-card border-white/10">
              <h3 className="text-lg font-bold mb-4">3D Geometry Quiz</h3>
              
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
                      <span>Question {questionIndex + 1} of {filteredQuestions.length}</span>
                      <span>Score: {score}/{filteredQuestions.length}</span>
                    </div>
                    
                    <Card className="p-4 bg-muted/20 border-white/10">
                      <h3 className="text-lg font-medium mb-4">{filteredQuestions[questionIndex].text}</h3>
                      
                      {filteredQuestions[questionIndex].figure && (
                        <div className="mb-4 p-4 bg-muted/30 flex justify-center">
                          <img src={filteredQuestions[questionIndex].figure} alt="Geometry figure" className="max-h-48" />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        {filteredQuestions[questionIndex].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className={`justify-start text-left h-auto py-3 ${
                              selectedAnswer === index ? "border-primary bg-primary/20" : "border-white/10"
                            } ${
                              showExplanation && index === filteredQuestions[questionIndex].correctAnswer
                                ? "border-green-500 bg-green-500/20"
                                : ""
                            } ${
                              showExplanation && selectedAnswer === index && 
                              index !== filteredQuestions[questionIndex].correctAnswer
                                ? "border-red-500 bg-red-500/20"
                                : ""
                            }`}
                            onClick={() => handleSelectAnswer(index)}
                          >
                            {showExplanation && index === filteredQuestions[questionIndex].correctAnswer && (
                              <CheckCircle size={16} className="mr-2 text-green-500" />
                            )}
                            {showExplanation && selectedAnswer === index && 
                              index !== filteredQuestions[questionIndex].correctAnswer && (
                              <XCircle size={16} className="mr-2 text-red-500" />
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
                            <p>{filteredQuestions[questionIndex].explanation}</p>
                          </div>
                          
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={handleNextQuestion}
                          >
                            {questionIndex < filteredQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
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
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-6 bg-gradient-to-r from-red-900/20 to-black border-white/10">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Star size={20} className="text-primary" />
            Real-World Applications of Geometry
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Architecture & Design</h4>
              <p className="text-sm">Architects use geometry to design aesthetically pleasing and structurally sound buildings. Golden ratio, symmetry, and geometric patterns are fundamental to architectural design.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Engineering</h4>
              <p className="text-sm">Engineers apply geometric principles to create efficient structures, machines, and systems. Stress analysis, fluid dynamics, and material optimization all rely on geometric calculations.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Computer Graphics</h4>
              <p className="text-sm">3D modeling, animation, and video game design depend on computational geometry. Rendering realistic scenes requires precise geometric transformations and calculations.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Medicine & Biology</h4>
              <p className="text-sm">Medical imaging uses geometric algorithms to reconstruct 3D models from 2D scans. Molecular biology studies the geometric arrangements of atoms in proteins and DNA.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Art & Design</h4>
              <p className="text-sm">Artists use geometric principles for perspective, proportion, and composition. Geometric patterns feature prominently in many cultural art traditions around the world.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Navigation & GPS</h4>
              <p className="text-sm">Navigation systems use spherical geometry to calculate distances and routes on Earth's surface. GPS triangulation relies on geometric principles to determine precise locations.</p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GeometryDash;

function Cube(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m21 16.003v-8.002a2 2 0 0 0-1-1.732l-7-4.030a2 2 0 0 0-2 0l-7 4.03a2 2 0 0 0-1 1.732v8.002a2 2 0 0 0 1 1.732l7 4.03a2 2 0 0 0 2 0l7-4.03a2 2 0 0 0 1-1.732z"/>
      <path d="M3.5 9 12 13l8.5-4"/>
      <path d="M12 22V13"/>
    </svg>
  );
}
