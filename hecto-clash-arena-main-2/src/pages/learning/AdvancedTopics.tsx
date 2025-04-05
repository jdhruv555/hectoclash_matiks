import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Calculator, BrainCircuit, YoutubeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MathTopicsGallery from "@/components/MathTopicsGallery";
import VideoLectureGallery from "@/components/VideoLectureGallery";

import { mathTopics } from "@/components/MathTopicsGallery";

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

interface ApplicationDetail {
  field: string;
  description: string;
  examples: string[];
}

const advancedMathVideos = [
  {
    id: "v1",
    title: "Essence of Calculus - Chapter 1",
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
    title: "The Essence of Linear Algebra",
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
    title: "Permutations and Combinations - Counting Using Combinatorics",
    channel: "The Organic Chemistry Tutor",
    thumbnail: "https://i.ytimg.com/vi/XqQTXW7XfYA/maxresdefault.jpg",
    duration: "58:58",
    views: "1.2M",
    likes: "24K",
    url: "https://www.youtube.com/watch?v=XqQTXW7XfYA",
    description: "Comprehensive tutorial on permutations and combinations with multiple examples and applications.",
    category: "Combinatorics",
    difficulty: "Intermediate" as const
  },
  {
    id: "v4",
    title: "Complex Analysis: Queen of Mathematics",
    channel: "Zach Star",
    thumbnail: "https://i.ytimg.com/vi/dugL0oYx0w0/maxresdefault.jpg",
    duration: "12:34",
    views: "598K",
    likes: "32K",
    url: "https://www.youtube.com/watch?v=dugL0oYx0w0",
    description: "Introduction to complex analysis and its applications across various fields of mathematics and physics.",
    category: "Complex Analysis",
    difficulty: "Advanced" as const
  },
  {
    id: "v5",
    title: "Probability explained | Independent and dependent events",
    channel: "Khan Academy",
    thumbnail: "https://i.ytimg.com/vi/uzkc-qNVoOk/maxresdefault.jpg",
    duration: "12:27",
    views: "3.1M",
    likes: "42K",
    url: "https://www.youtube.com/watch?v=uzkc-qNVoOk",
    description: "Learn how to calculate the probability of independent and dependent events, with various examples.",
    category: "Probability",
    difficulty: "Beginner" as const
  },
  {
    id: "v6",
    title: "Introduction to Higher Mathematics - Lecture 1: Proof Techniques",
    channel: "Bill Shillito",
    thumbnail: "https://i.ytimg.com/vi/MXJ-zpJeY3E/maxresdefault.jpg",
    duration: "48:39",
    views: "420K",
    likes: "12K",
    url: "https://www.youtube.com/watch?v=MXJ-zpJeY3E",
    description: "Introduction to mathematical proofs, including direct proof, contrapositive, contradiction, and induction.",
    category: "Higher Mathematics",
    difficulty: "Advanced" as const
  },
  {
    id: "v7",
    title: "The Fundamental Theorem of Calculus",
    channel: "MIT OpenCourseWare",
    thumbnail: "https://i.ytimg.com/vi/1RLctDS2hUQ/maxresdefault.jpg",
    duration: "41:22",
    views: "857K",
    likes: "15K",
    url: "https://www.youtube.com/watch?v=1RLctDS2hUQ",
    description: "Professor David Jerison explains the fundamental theorem of calculus and its applications.",
    category: "Calculus",
    difficulty: "Intermediate" as const
  },
  {
    id: "v8",
    title: "Introduction to Topology: Basic Concepts",
    channel: "PBS Infinite Series",
    thumbnail: "https://i.ytimg.com/vi/SXEdIkp_J_w/maxresdefault.jpg",
    duration: "10:39",
    views: "632K",
    likes: "28K",
    url: "https://www.youtube.com/watch?v=SXEdIkp_J_w",
    description: "Learn about the basic concepts of topology, including open sets, closed sets, and homeomorphisms.",
    category: "Topology",
    difficulty: "Advanced" as const
  },
  {
    id: "v9",
    title: "Real Analysis: Sequences and the ε-N Definition of a Limit",
    channel: "Dr. Trefor Bazett",
    thumbnail: "https://i.ytimg.com/vi/49QTD4klvP8/maxresdefault.jpg",
    duration: "19:03",
    views: "231K",
    likes: "9K",
    url: "https://www.youtube.com/watch?v=49QTD4klvP8",
    description: "Detailed explanation of sequences and the epsilon-N definition of a limit in real analysis.",
    category: "Real Analysis",
    difficulty: "Advanced" as const
  },
  {
    id: "v10",
    title: "HCF and LCM: Tricks for Fast Calculation",
    channel: "MathsSmart",
    thumbnail: "https://i.ytimg.com/vi/GvvhG7P3G1o/maxresdefault.jpg",
    duration: "15:21",
    views: "1.4M",
    likes: "45K",
    url: "https://www.youtube.com/watch?v=GvvhG7P3G1o",
    description: "Learn quick techniques to find HCF and LCM of numbers, with applications to problem-solving.",
    category: "Number Theory",
    difficulty: "Beginner" as const
  }
];

const mathFacts = [
  "The sum of all natural numbers (1+2+3+4+...) equals -1/12 according to analytical continuation.",
  "There are infinitely many prime numbers, as proven by Euclid around 300 BCE.",
  "Pi (π) is an irrational number, meaning its decimal representation never ends or repeats.",
  "The Fibonacci sequence appears in nature, from sunflower seed patterns to spiral galaxies.",
  "A Möbius strip has only one side and one edge, despite appearing to have two.",
  "The Greek mathematician Pythagoras founded a religious movement based on mathematics.",
  "There are exactly 6 platonic solids in 4-dimensional space, compared to just 5 in 3D.",
  "The number 0 was independently invented multiple times, but wasn't widely used in Europe until the 12th century.",
  "Euler's identity (e^(iπ) + 1 = 0) is often considered the most beautiful equation in mathematics.",
  "The Monster Group, the largest sporadic simple group, has more than 8×10^53 elements."
];

const applicationDetails: Record<string, ApplicationDetail[]> = {
  "Physics & Engineering": [
    {
      field: "Mechanics",
      description: "Mathematical models describe motion, forces, and energy in physical systems.",
      examples: [
        "Newton's laws of motion are expressed as differential equations that predict the movement of objects",
        "The wave equation models vibrations in strings, membranes, and electromagnetic fields",
        "Structural analysis uses linear algebra to model forces and stresses in buildings and bridges"
      ]
    },
    {
      field: "Electromagnetism",
      description: "Maxwell's equations, a set of partial differential equations, govern electromagnetic phenomena.",
      examples: [
        "Field calculations for electrical equipment design",
        "Waveguide and antenna analysis for telecommunications",
        "Modeling of electromagnetic interference in circuit design"
      ]
    },
    {
      field: "Quantum Mechanics",
      description: "Advanced mathematics including linear operators and complex functions are essential to quantum theory.",
      examples: [
        "The Schrödinger equation describes how quantum states evolve over time",
        "Hilbert spaces represent the possible states of quantum systems",
        "Quantum computing algorithms rely on complex linear algebra"
      ]
    }
  ],
  "Computer Science": [
    {
      field: "Algorithm Design",
      description: "Mathematical principles underpin efficient computation and problem-solving techniques.",
      examples: [
        "Graph theory enables shortest path algorithms for navigation systems",
        "Number theory provides the foundation for cryptographic algorithms used in secure communications",
        "Recurrence relations help analyze algorithm complexity and performance"
      ]
    },
    {
      field: "Machine Learning",
      description: "Statistical methods and linear algebra form the basis of AI and machine learning systems.",
      examples: [
        "Neural networks use matrices of weights optimized through calculus-based methods",
        "Principal component analysis reduces data dimensionality using eigenvalues and eigenvectors",
        "Probability theory underpins Bayesian models and decision trees"
      ]
    },
    {
      field: "Computer Graphics",
      description: "3D rendering and animation rely heavily on geometry and linear algebra.",
      examples: [
        "Transformation matrices for rotation, scaling, and translation of 3D objects",
        "Ray tracing algorithms use geometric intersections to generate realistic lighting",
        "Bezier curves and splines create smooth surfaces and animations"
      ]
    }
  ],
  "Finance & Economics": [
    {
      field: "Financial Modeling",
      description: "Mathematical models predict market behavior and optimize investment strategies.",
      examples: [
        "The Black-Scholes equation for option pricing uses partial differential equations",
        "Portfolio optimization applies quadratic programming to maximize return for a given risk level",
        "Time series analysis forecasts market trends using statistical methods"
      ]
    },
    {
      field: "Risk Management",
      description: "Probability theory and statistics help quantify and mitigate financial risks.",
      examples: [
        "Value at Risk (VaR) calculations estimate potential losses using probability distributions",
        "Monte Carlo simulations model possible outcomes of investment strategies",
        "Stress testing uses statistical outliers to assess system stability under extreme conditions"
      ]
    },
    {
      field: "Economic Theory",
      description: "Mathematical models describe economic systems and predict outcomes of policy decisions.",
      examples: [
        "Game theory models strategic interactions between rational decision-makers",
        "Differential equations model economic growth and dynamic equilibria",
        "Econometrics uses statistical methods to test economic theories with empirical data"
      ]
    }
  ],
  "Medicine & Biology": [
    {
      field: "Epidemiology",
      description: "Mathematical models track and predict the spread of diseases in populations.",
      examples: [
        "SIR models use differential equations to predict infection rates during epidemics",
        "Network theory models disease transmission through contact patterns",
        "Bayesian statistics improve estimates of disease prevalence and risk factors"
      ]
    },
    {
      field: "Medical Imaging",
      description: "Advanced mathematics enables the reconstruction and analysis of internal body structures.",
      examples: [
        "Fourier transforms convert MRI signals into detailed cross-sectional images",
        "Tomographic reconstruction algorithms create 3D models from 2D X-ray slices",
        "Image segmentation algorithms identify boundaries between tissues and organs"
      ]
    },
    {
      field: "Genomics",
      description: "Statistical methods and algorithms analyze genetic information and predict protein structures.",
      examples: [
        "Hidden Markov models identify genes in DNA sequences",
        "Clustering algorithms group genes with similar expression patterns",
        "Graph theory represents biochemical pathways and protein interactions"
      ]
    }
  ],
  "Art & Design": [
    {
      field: "Architecture",
      description: "Geometric principles guide the design of aesthetically pleasing and structurally sound buildings.",
      examples: [
        "The golden ratio creates harmonious proportions in building facades and floor plans",
        "Tensile structures use minimal surfaces from differential geometry to create efficient roofs",
        "Fractals inspire organic architectural forms and self-similar patterns"
      ]
    },
    {
      field: "Digital Art",
      description: "Mathematical algorithms generate complex patterns and visual effects.",
      examples: [
        "Procedural generation creates landscapes, textures, and structures from mathematical rules",
        "Cellular automata produce complex patterns from simple iterative rules",
        "L-systems model plant growth for realistic virtual vegetation"
      ]
    },
    {
      field: "Music Theory",
      description: "Mathematical relationships define musical harmony, rhythm, and composition.",
      examples: [
        "Frequency ratios determine consonant musical intervals",
        "Modular arithmetic describes rhythmic patterns and time signatures",
        "Transformation theory analyzes relationships between musical structures"
      ]
    }
  ]
};

const AdvancedTopics: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<MathTopic | null>(null);
  const [currentFact, setCurrentFact] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetail[] | null>(null);

  const handleChangeFact = () => {
    setCurrentFact((prev) => (prev + 1) % mathFacts.length);
  };

  const handleLearnMore = (application: string) => {
    setSelectedApplication(application);
    setApplicationDetails(applicationDetails[application] || null);
  };

  return (
    <PageLayout
      title="Advanced Mathematics"
      subtitle="Explore complex mathematical concepts, theory, and applications"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="p-5 bg-gradient-to-r from-red-900/20 to-black border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Mathematics Fact</h3>
              <p className="text-white italic">"{mathFacts[currentFact]}"</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleChangeFact}
              className="min-w-[120px] border-white/10 hover:bg-primary/20"
            >
              Next Fact
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger 
              value="topics" 
              className="data-[state=active]:bg-primary gap-2"
            >
              <BookOpen size={16} />
              Math Topics
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="data-[state=active]:bg-primary gap-2"
            >
              <YoutubeIcon size={16} />
              Video Lectures
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-primary gap-2"
            >
              <BrainCircuit size={16} />
              Real-World Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-primary">Mathematics Topic Explorer</h2>
                <p className="text-muted-foreground">Discover and learn about a wide range of mathematical concepts, from fundamental principles to advanced theories.</p>
              </div>
              
              <MathTopicsGallery onTopicSelect={setSelectedTopic} />
              
              {selectedTopic && (
                <div className="mt-8 p-6 border border-white/10 rounded-lg bg-gradient-to-br from-gray-900 to-black">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-black/40 text-primary">
                        {selectedTopic.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedTopic.title}</h2>
                        <p className="text-muted-foreground">{selectedTopic.category} • {selectedTopic.level}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white/10 hover:bg-primary/20"
                      onClick={() => setSelectedTopic(null)}
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-3 text-primary">Overview</h3>
                      <p className="text-gray-300 mb-6">{selectedTopic.description}</p>
                      
                      <h3 className="text-lg font-medium mb-3 text-primary">Key Topics</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                        {selectedTopic.topics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="bg-black/40 p-4 rounded-lg border border-white/10 mb-6">
                        <h3 className="text-lg font-medium mb-3 text-primary">Real-World Applications</h3>
                        <ul className="space-y-2">
                          {selectedTopic.category === "Algebra" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Computer Science:</strong> Algorithms, cryptography, database queries, and computer graphics all rely on algebraic structures and operations.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Engineering:</strong> Systems of equations model electronic circuits, structural analysis, and control systems in robotics.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Economics:</strong> Linear programming optimizes resource allocation. Matrices represent economic input-output models.</span>
                              </li>
                            </>
                          )}
                          {selectedTopic.category === "Calculus" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Physics:</strong> Describes motion, electromagnetic fields, and quantum mechanics. Differential equations model physical systems.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Engineering:</strong> Optimization of designs, analysis of heat transfer, fluid dynamics, and signal processing.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Economics:</strong> Marginal analysis in microeconomics, optimization of profit functions, and economic growth models.</span>
                              </li>
                            </>
                          )}
                          {selectedTopic.category === "Geometry" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Architecture:</strong> Design of buildings, spatial planning, and structural stability rely on geometric principles.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Computer Graphics:</strong> 3D modeling, animation, virtual reality, and video game development use computational geometry.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Navigation:</strong> GPS systems use spherical geometry to calculate positions and routes on Earth's surface.</span>
                              </li>
                            </>
                          )}
                          {selectedTopic.category === "Statistics" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Data Science:</strong> Statistical methods analyze big data, find patterns, and make predictions from complex datasets.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Medicine:</strong> Clinical trials use statistics to assess treatment efficacy. Epidemiology models disease spread.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Finance:</strong> Risk assessment, portfolio optimization, and insurance calculations all rely on probability theory.</span>
                              </li>
                            </>
                          )}
                          {selectedTopic.category === "Number Theory" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Cryptography:</strong> RSA encryption and other secure communication methods rely on properties of prime numbers.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Computer Science:</strong> Error-correcting codes, hash functions, and pseudorandom number generation.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Calendar Systems:</strong> The mathematics of time measurement and date calculations uses modular arithmetic.</span>
                              </li>
                            </>
                          )}
                          {selectedTopic.category === "Applied Math" && (
                            <>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Machine Learning:</strong> Neural networks, optimization algorithms, and pattern recognition use complex mathematical models.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Finance:</strong> Derivative pricing, portfolio optimization, and risk management use stochastic processes.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span><strong>Biology:</strong> Population dynamics, genetic algorithms, and molecular modeling use differential equations.</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        {selectedTopic.category === "Calculus" && (
                          <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/math-games/calculus-quest"}>
                            Practice with Calculus Quest
                          </Button>
                        )}
                        {selectedTopic.category === "Geometry" && (
                          <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/math-games/geometry-dash"}>
                            Practice with Geometry Dash
                          </Button>
                        )}
                        {selectedTopic.id === "permutation-combination" && (
                          <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/learning/interactive"}>
                            Take Interactive Lesson
                          </Button>
                        )}
                        <Button variant="outline" className="border-white/10 hover:bg-primary/20" onClick={() => window.location.href = "/learning/interactive"}>
                          Find More Resources
                        </Button>
                        <Button variant="outline" className="border-white/10 hover:bg-primary/20" onClick={() => setSelectedTopic(null)}>
                          Explore Other Topics
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Card className="bg-muted/30 p-4 border-white/10">
                        <h4 className="font-medium mb-3 text-primary">Related Topics</h4>
                        <ul className="space-y-2">
                          {mathTopics
                            .filter(t => t.category === selectedTopic.category && t.id !== selectedTopic.id)
                            .slice(0, 3)
                            .map(topic => (
                              <li key={topic.id}>
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start text-left hover:bg-primary/20 p-2 h-auto"
                                  onClick={() => setSelectedTopic(topic)}
                                >
                                  <div className="mr-2 text-primary">{topic.icon}</div>
                                  <div>
                                    <p className="font-medium">{topic.title}</p>
                                    <p className="text-xs text-muted-foreground">{topic.level}</p>
                                  </div>
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </Card>
                      
                      <Card className="bg-muted/30 p-4 border-white/10 mt-4">
                        <h4 className="font-medium mb-3 text-primary">Learning Resources</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong>Video Tutorials:</strong> Visual explanations of key concepts by expert educators.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong>Interactive Lessons:</strong> Hands-on practice with immediate feedback.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong>Problem Sets:</strong> Progressively challenging exercises to build skills.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong>Community Forum:</strong> Discuss concepts and solutions with peers.</span>
                          </li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-primary">Advanced Math Video Lectures</h2>
                <p className="text-muted-foreground">Watch high-quality educational videos that explain complex mathematical concepts.</p>
              </div>
              
              <Tabs defaultValue="all" className="w-full mb-6">
                <TabsList className="mb-4 bg-muted/70 flex flex-wrap h-auto">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary">All Topics</TabsTrigger>
                  <TabsTrigger value="Calculus" className="data-[state=active]:bg-primary">Calculus</TabsTrigger>
                  <TabsTrigger value="Linear Algebra" className="data-[state=active]:bg-primary">Linear Algebra</TabsTrigger>
                  <TabsTrigger value="Number Theory" className="data-[state=active]:bg-primary">Number Theory</TabsTrigger>
                  <TabsTrigger value="Probability" className="data-[state=active]:bg-primary">Probability & Statistics</TabsTrigger>
                  <TabsTrigger value="Higher Mathematics" className="data-[state=active]:bg-primary">Higher Mathematics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <VideoLectureGallery videos={advancedMathVideos} />
                </TabsContent>
                
                <TabsContent value="Calculus">
                  <VideoLectureGallery 
                    videos={advancedMathVideos.filter(v => v.category === "Calculus")} 
                  />
                </TabsContent>
                
                <TabsContent value="Linear Algebra">
                  <VideoLectureGallery 
                    videos={advancedMathVideos.filter(v => v.category === "Linear Algebra")} 
                  />
                </TabsContent>
                
                <TabsContent value="Number Theory">
                  <VideoLectureGallery 
                    videos={advancedMathVideos.filter(v => v.category === "Number Theory")} 
                  />
                </TabsContent>
                
                <TabsContent value="Probability">
                  <VideoLectureGallery 
                    videos={advancedMathVideos.filter(v => v.category === "Probability")} 
                  />
                </TabsContent>
                
                <TabsContent value="Higher Mathematics">
                  <VideoLectureGallery 
                    videos={advancedMathVideos.filter(v => 
                      v.category === "Higher Mathematics" || 
                      v.category === "Complex Analysis" || 
                      v.category === "Topology" || 
                      v.category === "Real Analysis"
                    )} 
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-primary">Mathematics in the Real World</h2>
                <p className="text-muted-foreground">Explore how advanced mathematical concepts are applied across various fields and industries.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Physics & Engineering</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Differential equations model physical systems</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Fourier analysis for signal processing</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Vector calculus for electromagnetic theory</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Numerical methods for structural analysis</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => handleLearnMore("Physics & Engineering")}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Computer Science</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Discrete mathematics for algorithms</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Graph theory for network optimization</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Boolean algebra for digital logic</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Number theory for cryptography</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => handleLearnMore("Computer Science")}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Finance & Economics</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Stochastic processes for market modeling</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Differential equations for option pricing</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Statistics for risk assessment</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Game theory for economic behavior</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => handleLearnMore("Finance & Economics")}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Data Science & AI</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Linear algebra for machine learning</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Calculus for optimization algorithms</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Probability theory for statistical models</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Information theory for data compression</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => window.location.href = "/learning/mental-math"}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Medicine & Biology</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Differential equations for population models</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Statistics for clinical trials</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Network theory for disease spread</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Fractals for modeling biological structures</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => handleLearnMore("Medicine & Biology")}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-white">Art & Design</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Geometry for architectural design</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Perspective theory in painting</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Fractal mathematics in digital art</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span>Symmetry groups in pattern design</span>
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-white/10 hover:bg-primary/20 hover:text-white"
                      onClick={() => handleLearnMore("Art & Design")}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              </div>
              
              {selectedApplication && applicationDetails && (
                <div className="mt-8 p-6 border border-white/10 rounded-lg bg-gradient-to-br from-gray-900 to-black">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-primary">{selectedApplication}</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white/10 hover:bg-primary/20"
                      onClick={() => {
                        setSelectedApplication(null);
                        setApplicationDetails(null);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {applicationDetails.map((detail, index) => (
                      <div key={index} className="p-4 bg-black/40 rounded-lg border border-white/10">
                        <h3 className="text-lg font-medium text-primary mb-2">{detail.field}</h3>
                        <p className="mb-3">{detail.description}</p>
                        
                        <h4 className="font-medium text-sm mb-2">Real-World Examples:</h4>
                        <ul className="space-y-1">
                          {detail.examples.map((example, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-4">
                      <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/learning/interactive"}>
                        Explore Related Lessons
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdvancedTopics;
