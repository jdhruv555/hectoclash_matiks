import React, { useReducer, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, ArrowRight, ChevronRight, Brain, Calculator, Lightbulb, Trophy, Sparkles, ChevronDown } from "lucide-react";
import GameHeader from "@/components/GameHeader";
import HectocBoard from "@/components/HectocBoard";
import Timer from "@/components/Timer";
import LevelProgress from "@/components/LevelProgress";
import DifficultySelector from "@/components/DifficultySelector";
import TopNavigation from "@/components/TopNavigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { generatePuzzle, getSampleSolution } from "@/utils/puzzleGenerator";
import { gameReducer, initialGameState, GameState, Difficulty } from "@/utils/gameLogic";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";
import PointsAnimation from "@/components/PointsAnimation";
import { motion } from "framer-motion";

const FeaturedGames = [
  {
    id: "hectoclash",
    title: "HectoClash",
    description: "Use math operators to reach exactly 100 using all digits in a sequence",
    path: "/math-games/hectoclash",
    icon: Calculator
  },
  {
    id: "speed-math",
    title: "Speed Math Challenge",
    description: "Solve equations against the clock to test your mental calculation speed",
    path: "/math-games/speed-math",
    icon: Play
  },
  {
    id: "memory-games",
    title: "Memory Match",
    description: "Test your memory with equation matching in this challenging brain game",
    path: "/brain-teasers/memory-games",
    icon: Brain
  },
  {
    id: "mental-math",
    title: "Mental Math Mastery",
    description: "Learn powerful techniques to calculate faster in your head",
    path: "/learning/mental-math",
    icon: Lightbulb
  }
];

const PopularGames = [
  {
    id: "logic-puzzles",
    title: "Math Sudoku",
    description: "Classic sudoku with mathematical twists",
    difficulty: "Medium",
    category: "Logic",
    path: "/brain-teasers/logic-puzzles",
    color: "#e74c3c"
  },
  {
    id: "number-puzzles",
    title: "Equation Builder",
    description: "Create valid equations from random numbers",
    difficulty: "Hard",
    category: "Algebra",
    path: "/math-games/number-puzzles",
    color: "#3498db"
  },
  {
    id: "pattern-recognition",
    title: "Pattern Solver",
    description: "Identify the next number in complex sequences",
    difficulty: "Expert",
    category: "Patterns",
    path: "/brain-teasers/pattern-recognition",
    color: "#9b59b6"
  },
  {
    id: "speed-math",
    title: "Division Master",
    description: "Test your division skills with increasingly difficult problems",
    difficulty: "Medium",
    category: "Arithmetic",
    path: "/math-games/speed-math",
    color: "#2ecc71"
  },
  {
    id: "number-puzzles-2",
    title: "Fraction Fighter",
    description: "Compare and simplify fractions in this fast-paced game",
    difficulty: "Easy",
    category: "Fractions",
    path: "/math-games/number-puzzles",
    color: "#f39c12"
  },
  {
    id: "geometry-dash",
    title: "Geometry Challenge",
    description: "Calculate areas and angles in geometric puzzles",
    difficulty: "Hard",
    category: "Geometry",
    path: "/math-games/geometry-dash",
    color: "#1abc9c"
  },
  {
    id: "cryptarithmetic",
    title: "Cryptarithmetic",
    description: "Solve letter-for-digit substitution puzzles",
    difficulty: "Expert",
    category: "Cryptarithmetic",
    path: "/math-games/cryptarithmetic",
    color: "#e67e22"
  }
];

const Index: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [showHint, setShowHint] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [visibleGames, setVisibleGames] = useState(4);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const startGame = useCallback(() => {
    const newPuzzle = generatePuzzle(gameState.difficulty);
    dispatch({ type: 'START_GAME', puzzle: newPuzzle, difficulty: gameState.difficulty });
    setShowHint(false);
  }, [gameState.difficulty]);
  
  const nextLevel = useCallback(() => {
    const newPuzzle = generatePuzzle(gameState.difficulty);
    dispatch({ type: 'NEXT_LEVEL', puzzle: newPuzzle });
    setShowHint(false);
    toast.success(`Level ${gameState.level + 1} started!`);
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [gameState.level, gameState.difficulty]);
  
  const handleChangeDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'CHANGE_DIFFICULTY', difficulty });
    toast.info(`Difficulty set to ${difficulty}`);
  }, []);
  
  const handleShowHint = useCallback(() => {
    if (gameState.puzzle) {
      const solution = getSampleSolution(gameState.puzzle);
      setShowHint(true);
      toast.info("Here's a hint on how to solve this puzzle!");
    }
  }, [gameState.puzzle]);
  
  const loadMoreGames = () => {
    if (visibleGames < PopularGames.length) {
      setVisibleGames(PopularGames.length);
      setShowAllGames(true);
    } else {
      setVisibleGames(4);
      setShowAllGames(false);
    }
  };
  
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (gameState.gameActive) {
      timerInterval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState.gameActive]);
  
  useEffect(() => {
    if (gameState.showPointsAnimation) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_POINTS_ANIMATION' });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.showPointsAnimation]);
  
  useEffect(() => {
    if (gameState.gameCompleted && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameCompleted]);
  
  const handleAddDigit = (digit: string) => {
    dispatch({ type: 'ADD_DIGIT', digit });
  };
  
  const handleAddOperator = (operator: string) => {
    dispatch({ type: 'ADD_OPERATOR', operator });
  };
  
  const handleRemoveLast = () => {
    dispatch({ type: 'REMOVE_LAST' });
  };
  
  const handleClearSolution = () => {
    dispatch({ type: 'CLEAR_SOLUTION' });
  };
  
  const handleCheckSolution = () => {
    dispatch({ type: 'CHECK_SOLUTION' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/90">
      <TopNavigation />
      
      <motion.div 
        className="mb-16 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-black/20 rounded-3xl -z-10"></div>
        <div className="text-center py-16 px-4 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-sm">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            TRAIN YOUR BRAIN WITH <span className="math-gradient-text">MATH CHALLENGES</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Sharpen your mathematical skills with our collection of brain-boosting games, 
            puzzles, and learning resources designed for all skill levels.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-bold flex items-center gap-2 rounded-xl"
              onClick={() => window.location.href = '#featured-games'}
            >
              Explore Games <ArrowRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-6 text-lg border-white/20 hover:bg-white/5 rounded-xl"
              onClick={() => window.location.href = '#play-now'}
            >
              Play Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.section 
        id="featured-games" 
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-8">
          <Sparkles className="text-primary mr-2" size={24} />
          <h2 className="text-3xl font-bold">Featured Games</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FeaturedGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Link to={game.path} className="featured-card group card-3d">
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <game.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                  <p className="text-gray-400 flex-grow">{game.description}</p>
                  <div className="mt-4 flex items-center text-primary/80 group-hover:text-primary transition-colors">
                    <span className="text-sm font-medium">Play Now</span>
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      <section id="play-now" className="mb-16">
        <div className="flex items-center mb-8">
          <Play className="text-primary mr-2" size={24} />
          <h2 className="text-3xl font-bold">HectoClash - The Ultimate Mental Math Duel</h2>
        </div>
        
        {gameState.puzzle ? (
          <div className="w-full max-w-md mx-auto space-y-6">
            <Timer 
              timeLeft={gameState.timeLeft} 
              gameActive={gameState.gameActive} 
              maxTime={initialGameState.timeLeft}
            />
            
            <HectocBoard
              puzzle={gameState.puzzle}
              currentSolution={gameState.currentSolution}
              onAddDigit={handleAddDigit}
              onAddOperator={handleAddOperator}
              onRemoveLast={handleRemoveLast}
              onClearSolution={handleClearSolution}
              onCheckSolution={handleCheckSolution}
              gameActive={gameState.gameActive}
              gameCompleted={gameState.gameCompleted}
            />
            
            {gameState.gameCompleted && !gameState.gameActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Button 
                  className="w-full bg-game-accent hover:bg-game-accent/90 py-6 text-lg font-bold flex items-center justify-center gap-2 animate-glow-pulse"
                  onClick={nextLevel}
                >
                  NEXT LEVEL <ChevronRight size={20} />
                </Button>
              </motion.div>
            )}
            
            {!gameState.gameActive && !gameState.gameCompleted && (
              <div className="flex justify-center">
                <Button 
                  className="game-btn flex items-center gap-2"
                  onClick={startGame}
                >
                  <RotateCcw size={18} />
                  {gameState.puzzlesSolved > 0 ? "Try Again" : "New Puzzle"}
                </Button>
              </div>
            )}
            
            {gameState.gameActive && !showHint && (
              <div className="text-center">
                <button 
                  onClick={handleShowHint}
                  className="text-game-muted-text hover:text-game-primary text-sm underline"
                >
                  Need a hint?
                </button>
              </div>
            )}
            
            {showHint && (
              <motion.div 
                className="bg-muted/20 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-game-muted-text mb-1">Sample Solution:</p>
                <p className="font-mono">{getSampleSolution(gameState.puzzle)}</p>
              </motion.div>
            )}
            
            <GameHeader 
              score={gameState.score} 
              level={gameState.level} 
              puzzlesSolved={gameState.puzzlesSolved}
              streakCount={gameState.streakCount}
            />
            
            <LevelProgress level={gameState.level} difficulty={gameState.difficulty} />
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center gap-6 p-8 bg-card/60 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full mx-auto border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center neon-text">READY TO CHALLENGE YOUR MATH SKILLS?</h2>
            <p className="text-center text-game-muted-text">
              Use mathematical operations to make 100 with six digits in order!
            </p>
            
            <DifficultySelector 
              currentDifficulty={gameState.difficulty}
              onSelectDifficulty={handleChangeDifficulty}
            />
            
            <Button 
              variant="game"
              className="w-full flex items-center gap-2 text-lg px-8 py-6 rounded-xl"
              onClick={startGame}
            >
              <Play size={20} />
              START GAME
            </Button>
          </motion.div>
        )}
      </section>
      
      <section className="mb-16">
        <div className="bg-gradient-to-br from-black to-gray-900 rounded-xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Brain Training with Math Games?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Cognitive Development</h3>
              <p className="text-gray-400">Mathematical games improve problem-solving abilities, logical reasoning, and pattern recognition skills.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Math Proficiency</h3>
              <p className="text-gray-400">Regular practice with math games enhances calculation speed, accuracy, and overall mathematical fluency.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fun Learning</h3>
              <p className="text-gray-400">Our games make learning enjoyable, creating positive associations with mathematics and increased engagement.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16" id="popular-games">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Trophy className="text-primary mr-2" size={24} />
            <h2 className="text-3xl font-bold">Popular Games</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PopularGames.slice(0, visibleGames).map((game) => (
            <Link to={game.path} key={game.id} className="group">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 h-full">
                <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: game.color }}></div>
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded-md text-xs" style={{ backgroundColor: `${game.color}30`, color: game.color }}>{game.category}</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md">{game.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">{game.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{game.description}</p>
                  <Button variant="outline" className="mt-auto border-primary/30 hover:bg-primary/10 hover:text-primary w-full transition-colors group-hover:bg-primary/20">
                    Play Game
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {PopularGames.length > 4 && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={loadMoreGames} 
              variant="outline" 
              className="border-white/20 hover:bg-white/5 flex items-center gap-2"
            >
              {showAllGames ? "Show Less" : "Show More Games"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAllGames ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        )}
      </section>
      
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Lightbulb className="text-primary mr-2" size={24} />
          <h2 className="text-3xl font-bold">Learning Resources</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/learning/tutorials" className="video-card group">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Math Tutorials</h3>
              <p className="text-gray-400">Step-by-step guides for mastering mathematical concepts</p>
            </div>
          </Link>
          
          <Link to="/learning/mental-math" className="video-card group">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Mental Math Tricks</h3>
              <p className="text-gray-400">Learn shortcuts for rapid calculations in your head</p>
            </div>
          </Link>
          
          <Link to="/learning/interactive" className="video-card group">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Interactive Lessons</h3>
              <p className="text-gray-400">Engage with lessons that test your understanding</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-white/20 hover:bg-white/5">
            View All Learning Resources <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>
      
      <section className="text-center mb-8">
        <div className="bg-gradient-to-r from-red-900/30 to-black/30 p-12 rounded-xl border border-white/5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Challenge Your Brain?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start with any of our games and track your progress as you improve your mathematical abilities.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-bold rounded-xl"
            onClick={() => window.location.href = '#popular-games'}
          >
            Get Started Now
          </Button>
        </div>
      </section>
      
      <Confetti active={showConfetti} />
      
      <PointsAnimation 
        points={gameState.lastPointsEarned} 
        isActive={gameState.showPointsAnimation}
        onComplete={() => dispatch({ type: 'HIDE_POINTS_ANIMATION' })}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
