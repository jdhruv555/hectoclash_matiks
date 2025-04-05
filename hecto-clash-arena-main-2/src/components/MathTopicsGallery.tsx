
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  GraduationCap, 
  BrainCircuit, 
  Calculator, 
  PieChart, 
  Sigma, 
  Code, 
  Infinity,
  Binary,
  BarChart3
} from "lucide-react";

interface MathTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  category: "Algebra" | "Geometry" | "Calculus" | "Statistics" | "Number Theory" | "Applied Math";
  colorClass: string;
}

export const mathTopics: MathTopic[] = [
  {
    id: "basic-algebra",
    title: "Basic Algebra",
    description: "Learn the fundamental concepts of algebra including variables, expressions, and equations.",
    icon: <Code size={24} />,
    level: "Beginner",
    topics: ["Variables and constants", "Algebraic expressions", "Linear equations", "Quadratic equations", "Factoring", "Systems of equations"],
    category: "Algebra",
    colorClass: "bg-blue-900/20 border-blue-700/30"
  },
  {
    id: "advanced-algebra",
    title: "Advanced Algebra",
    description: "Explore complex algebraic structures and operations with polynomials and matrices.",
    icon: <Sigma size={24} />,
    level: "Advanced",
    topics: ["Polynomial functions", "Complex numbers", "Matrix operations", "Determinants", "Eigenvalues", "Abstract algebra", "Group theory"],
    category: "Algebra",
    colorClass: "bg-blue-900/20 border-blue-700/30"
  },
  {
    id: "euclidean-geometry",
    title: "Euclidean Geometry",
    description: "Study the properties of shapes, sizes, and positions of figures in space.",
    icon: <GraduationCap size={24} />,
    level: "Beginner",
    topics: ["Points, lines, and angles", "Triangles and polygons", "Circles", "Area and perimeter", "Congruence and similarity", "Coordinate geometry"],
    category: "Geometry",
    colorClass: "bg-green-900/20 border-green-700/30"
  },
  {
    id: "non-euclidean-geometry",
    title: "Non-Euclidean Geometry",
    description: "Explore geometries that reject Euclid's parallel postulate, including spherical and hyperbolic geometries.",
    icon: <Infinity size={24} />,
    level: "Advanced",
    topics: ["Spherical geometry", "Hyperbolic geometry", "Projective geometry", "Differential geometry", "Topology", "Manifolds"],
    category: "Geometry",
    colorClass: "bg-green-900/20 border-green-700/30"
  },
  {
    id: "differential-calculus",
    title: "Differential Calculus",
    description: "Study rates of change and slopes of curves, including derivatives and their applications.",
    icon: <BookOpen size={24} />,
    level: "Intermediate",
    topics: ["Limits and continuity", "Derivatives", "Differentiation rules", "Applications of derivatives", "Optimization", "Related rates"],
    category: "Calculus",
    colorClass: "bg-red-900/20 border-red-700/30"
  },
  {
    id: "integral-calculus",
    title: "Integral Calculus",
    description: "Learn about integration, areas under curves, and applications in physics and engineering.",
    icon: <Calculator size={24} />,
    level: "Intermediate",
    topics: ["Indefinite integrals", "Definite integrals", "Fundamental theorem of calculus", "Integration techniques", "Applications of integration", "Improper integrals"],
    category: "Calculus",
    colorClass: "bg-red-900/20 border-red-700/30"
  },
  {
    id: "multivariable-calculus",
    title: "Multivariable Calculus",
    description: "Extend calculus concepts to functions of multiple variables, including vectors and surfaces in space.",
    icon: <BrainCircuit size={24} />,
    level: "Advanced",
    topics: ["Partial derivatives", "Multiple integrals", "Vector calculus", "Green's theorem", "Stokes' theorem", "Divergence theorem"],
    category: "Calculus",
    colorClass: "bg-red-900/20 border-red-700/30"
  },
  {
    id: "descriptive-statistics",
    title: "Descriptive Statistics",
    description: "Learn to collect, analyze, and present data using measures of central tendency and dispersion.",
    icon: <PieChart size={24} />,
    level: "Beginner",
    topics: ["Data collection", "Measures of central tendency", "Measures of dispersion", "Data visualization", "Frequency distributions", "Correlation"],
    category: "Statistics",
    colorClass: "bg-purple-900/20 border-purple-700/30"
  },
  {
    id: "probability-theory",
    title: "Probability Theory",
    description: "Study the mathematics of chance and uncertainty, with applications to statistics and machine learning.",
    icon: <BarChart3 size={24} />,
    level: "Intermediate",
    topics: ["Sample spaces", "Probability axioms", "Conditional probability", "Random variables", "Probability distributions", "Expected value", "Variance"],
    category: "Statistics",
    colorClass: "bg-purple-900/20 border-purple-700/30"
  },
  {
    id: "inferential-statistics",
    title: "Inferential Statistics",
    description: "Make inferences and predictions about populations based on sample data.",
    icon: <Binary size={24} />,
    level: "Advanced",
    topics: ["Sampling distributions", "Confidence intervals", "Hypothesis testing", "Regression analysis", "ANOVA", "Statistical power", "Bayesian statistics"],
    category: "Statistics",
    colorClass: "bg-purple-900/20 border-purple-700/30"
  },
  {
    id: "number-theory",
    title: "Number Theory",
    description: "Explore the properties and relationships of numbers, focusing on integers and their properties.",
    icon: <Sigma size={24} />,
    level: "Intermediate",
    topics: ["Prime numbers", "Divisibility", "Congruences", "Diophantine equations", "Modular arithmetic", "Cryptography applications", "Fermat's theorems"],
    category: "Number Theory",
    colorClass: "bg-yellow-900/20 border-yellow-700/30"
  },
  {
    id: "discrete-math",
    title: "Discrete Mathematics",
    description: "Study mathematical structures that are fundamentally discrete rather than continuous.",
    icon: <Binary size={24} />,
    level: "Intermediate",
    topics: ["Set theory", "Logic", "Combinatorics", "Graph theory", "Recurrence relations", "Algorithm analysis", "Boolean algebra"],
    category: "Applied Math",
    colorClass: "bg-orange-900/20 border-orange-700/30"
  },
  {
    id: "complex-analysis",
    title: "Complex Analysis",
    description: "Study the extension of calculus to complex numbers and complex-valued functions.",
    icon: <Code size={24} />,
    level: "Advanced",
    topics: ["Complex numbers", "Analytic functions", "Cauchy-Riemann equations", "Complex integration", "Power series", "Residue theorem", "Conformal mapping"],
    category: "Applied Math",
    colorClass: "bg-orange-900/20 border-orange-700/30"
  },
  {
    id: "mathematical-physics",
    title: "Mathematical Physics",
    description: "Explore mathematical methods used in solving problems in physics and engineering.",
    icon: <Infinity size={24} />,
    level: "Advanced",
    topics: ["Differential equations", "Fourier analysis", "Vector calculus", "Tensor analysis", "Group theory in physics", "Dynamical systems", "Quantum mechanics"],
    category: "Applied Math",
    colorClass: "bg-orange-900/20 border-orange-700/30"
  },
  {
    id: "hcf-lcm",
    title: "HCF and LCM",
    description: "Understand highest common factors and least common multiples with applications.",
    icon: <Calculator size={24} />,
    level: "Beginner",
    topics: ["Factors and multiples", "Prime factorization", "Euclidean algorithm", "Applications in fractions", "GCD and LCM properties", "Word problems"],
    category: "Number Theory",
    colorClass: "bg-yellow-900/20 border-yellow-700/30"
  },
  {
    id: "permutation-combination",
    title: "Permutations & Combinations",
    description: "Learn the mathematics of counting, arranging, and selecting objects from a set.",
    icon: <Binary size={24} />,
    level: "Intermediate",
    topics: ["Factorial notation", "Permutation formulas", "Combination formulas", "Permutations with repetition", "Binomial theorem", "Pascal's triangle", "Applications in probability"],
    category: "Number Theory",
    colorClass: "bg-yellow-900/20 border-yellow-700/30"
  }
];

interface MathTopicsGalleryProps {
  filter?: {
    category?: string;
    level?: string;
  };
  onTopicSelect?: (topic: MathTopic) => void;
}

const MathTopicsGallery: React.FC<MathTopicsGalleryProps> = ({ 
  filter,
  onTopicSelect
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeLevel, setActiveLevel] = useState<string>("all");
  
  // Apply filters from props if provided
  const effectiveCategory = filter?.category || activeCategory;
  const effectiveLevel = filter?.level || activeLevel;
  
  const filteredTopics = mathTopics.filter(topic => {
    const categoryMatch = effectiveCategory === "all" || topic.category === effectiveCategory;
    const levelMatch = effectiveLevel === "all" || topic.level === effectiveLevel;
    return categoryMatch && levelMatch;
  });

  const handleExploreClick = (topic: MathTopic, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    if (onTopicSelect) {
      onTopicSelect(topic);
    } else {
      // Default behavior if no onTopicSelect provided
      console.log("Exploring topic:", topic.title);
    }
  };
  
  return (
    <div className="space-y-6 w-full">
      {!filter && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-muted/50 flex flex-wrap h-auto">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveCategory("all")}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              All Topics
            </TabsTrigger>
            <TabsTrigger 
              value="Algebra" 
              onClick={() => setActiveCategory("Algebra")}
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Algebra
            </TabsTrigger>
            <TabsTrigger 
              value="Geometry" 
              onClick={() => setActiveCategory("Geometry")}
              className="data-[state=active]:bg-green-700 data-[state=active]:text-white"
            >
              Geometry
            </TabsTrigger>
            <TabsTrigger 
              value="Calculus" 
              onClick={() => setActiveCategory("Calculus")}
              className="data-[state=active]:bg-red-700 data-[state=active]:text-white"
            >
              Calculus
            </TabsTrigger>
            <TabsTrigger 
              value="Statistics" 
              onClick={() => setActiveCategory("Statistics")}
              className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Statistics & Probability
            </TabsTrigger>
            <TabsTrigger 
              value="Number Theory" 
              onClick={() => setActiveCategory("Number Theory")}
              className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white"
            >
              Number Theory
            </TabsTrigger>
            <TabsTrigger 
              value="Applied Math" 
              onClick={() => setActiveCategory("Applied Math")}
              className="data-[state=active]:bg-orange-700 data-[state=active]:text-white"
            >
              Applied Math
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {!filter && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeLevel === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveLevel("all")}
            className={activeLevel === "all" ? "bg-primary text-white" : "border-white/10"}
          >
            All Levels
          </Button>
          <Button 
            variant={activeLevel === "Beginner" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveLevel("Beginner")}
            className={activeLevel === "Beginner" ? "bg-green-600 text-white" : "border-white/10"}
          >
            Beginner
          </Button>
          <Button 
            variant={activeLevel === "Intermediate" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveLevel("Intermediate")}
            className={activeLevel === "Intermediate" ? "bg-yellow-600 text-white" : "border-white/10"}
          >
            Intermediate
          </Button>
          <Button 
            variant={activeLevel === "Advanced" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveLevel("Advanced")}
            className={activeLevel === "Advanced" ? "bg-red-600 text-white" : "border-white/10"}
          >
            Advanced
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <Card
            key={topic.id}
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${topic.colorClass} hover:border-primary/50 bg-black`}
            onClick={() => onTopicSelect && onTopicSelect(topic)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-full bg-black/40 text-primary">
                  {topic.icon}
                </div>
                <Badge 
                  className={`
                    ${topic.level === "Beginner" ? "bg-green-600" : ""}
                    ${topic.level === "Intermediate" ? "bg-yellow-600" : ""}
                    ${topic.level === "Advanced" ? "bg-red-600" : ""}
                  `}
                >
                  {topic.level}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold mb-2 text-white">{topic.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{topic.description}</p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-primary">Key Topics:</h4>
                <ScrollArea className="h-24 w-full rounded-md border border-white/10 p-2">
                  <ul className="text-xs space-y-1.5">
                    {topic.topics.map((subtopic, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-1.5">•</span>
                        <span>{subtopic}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
            <div className="px-5 pb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                onClick={(e) => handleExploreClick(topic, e)}
              >
                Explore Topic
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredTopics.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-lg text-muted-foreground">No topics found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default MathTopicsGallery;
