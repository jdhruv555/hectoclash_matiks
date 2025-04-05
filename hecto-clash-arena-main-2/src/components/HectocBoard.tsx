
import React, { useState, useEffect } from "react";
import OperatorButton from "./OperatorButton";
import { motion, AnimatePresence } from "framer-motion"; // Import motion from framer-motion for animations

interface HectocBoardProps {
  puzzle: string;
  currentSolution: string;
  onAddDigit: (digit: string) => void;
  onAddOperator: (operator: string) => void;
  onRemoveLast: () => void;
  onClearSolution: () => void;
  onCheckSolution: () => void;
  gameActive: boolean;
  gameCompleted: boolean;
}

const HectocBoard: React.FC<HectocBoardProps> = ({
  puzzle,
  currentSolution,
  onAddDigit,
  onAddOperator,
  onRemoveLast,
  onClearSolution,
  onCheckSolution,
  gameActive,
  gameCompleted
}) => {
  // Track which digits have been used
  const usedDigitIndices = new Set<number>();
  let puzzleIndex = 0;
  
  for (let i = 0; i < currentSolution.length; i++) {
    if (!isNaN(parseInt(currentSolution[i]))) {
      usedDigitIndices.add(puzzleIndex);
      puzzleIndex++;
    }
  }
  
  // Check if all digits have been used
  const allDigitsUsed = usedDigitIndices.size === puzzle.length;
  
  // Add a bit of animation state for feedback
  const [lastPressed, setLastPressed] = useState<number | null>(null);
  const [shakeSolution, setShakeSolution] = useState(false);
  const [highlightSolution, setHighlightSolution] = useState(false);
  
  // Add glow effect when all digits are used
  useEffect(() => {
    if (allDigitsUsed) {
      setHighlightSolution(true);
      const timer = setTimeout(() => setHighlightSolution(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [allDigitsUsed]);
  
  const handleDigitClick = (digit: string, index: number) => {
    if (!gameActive || usedDigitIndices.has(index) || gameCompleted) return;
    
    setLastPressed(index);
    setTimeout(() => setLastPressed(null), 300);
    onAddDigit(digit);
  };
  
  const handleOperatorClick = (operator: string) => {
    if (!gameActive || gameCompleted) return;
    onAddOperator(operator);
  };
  
  const handleRemoveLast = () => {
    if (!gameActive || gameCompleted) return;
    setShakeSolution(true);
    setTimeout(() => setShakeSolution(false), 300);
    onRemoveLast();
  };
  
  const handleClearSolution = () => {
    if (!gameActive || gameCompleted) return;
    setShakeSolution(true);
    setTimeout(() => setShakeSolution(false), 300);
    onClearSolution();
  };
  
  // Format the current solution with syntax highlighting
  const formatSolution = () => {
    if (!currentSolution) return "Build your expression...";
    
    // Simple syntax highlighting
    return currentSolution.split('').map((char, i) => {
      if (char === '+' || char === '-' || char === '*' || char === '/' || char === '(' || char === ')' || char === '**') {
        return <span key={i} className="text-indigo-400">{char}</span>;
      } else {
        return <span key={i} className="text-amber-300">{char}</span>;
      }
    });
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto bg-card p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={`solution-preview w-full ${highlightSolution ? 'ring-2 ring-amber-500/70 bg-amber-950/20' : ''}`}
        animate={shakeSolution ? { x: [0, -5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        {formatSolution()}
      </motion.div>
      
      <div className="flex justify-center gap-2 w-full">
        {puzzle.split('').map((digit, index) => {
          const isUsed = usedDigitIndices.has(index);
          const isNext = !isUsed && (index === 0 || usedDigitIndices.has(index - 1));
          
          return (
            <motion.button
              key={index}
              className={`digit-card ${isUsed ? 'opacity-50' : isNext ? 'animate-pulse-glow ring-2 ring-game-accent' : ''}`}
              onClick={() => handleDigitClick(digit, index)}
              disabled={!gameActive || isUsed || gameCompleted}
              whileTap={{ scale: 0.95 }}
              animate={lastPressed === index ? { scale: [1, 1.2, 1] } : {}}
              whileHover={!isUsed && gameActive && !gameCompleted ? { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" } : {}}
            >
              {digit}
            </motion.button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-4 gap-3 w-full">
        <OperatorButton 
          operator="+" 
          onClick={() => handleOperatorClick('+')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="-" 
          onClick={() => handleOperatorClick('-')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="×" 
          onClick={() => handleOperatorClick('*')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="÷" 
          onClick={() => handleOperatorClick('/')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="(" 
          onClick={() => handleOperatorClick('(')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator=")" 
          onClick={() => handleOperatorClick(')')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="^" 
          onClick={() => handleOperatorClick('**')} 
          disabled={!gameActive || gameCompleted} 
        />
        <OperatorButton 
          operator="⌫" 
          onClick={handleRemoveLast} 
          disabled={!gameActive || gameCompleted} 
        />
      </div>
      
      <div className="flex gap-3 w-full">
        <motion.button 
          className="game-btn flex-1 bg-muted hover:bg-muted/80" 
          onClick={handleClearSolution}
          disabled={!gameActive || gameCompleted}
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -3 }}
        >
          Clear
        </motion.button>
        <motion.button 
          className={`game-btn flex-1 ${allDigitsUsed ? 'bg-game-success hover:bg-game-success/90' : ''}`}
          onClick={onCheckSolution}
          disabled={!gameActive || currentSolution.length === 0 || gameCompleted}
          whileTap={{ scale: 0.95 }}
          whileHover={allDigitsUsed ? { scale: 1.05, y: -3 } : { y: -3 }}
          animate={allDigitsUsed ? { 
            boxShadow: ["0 0 0 rgba(0,200,0,0)", "0 0 20px rgba(0,200,0,0.7)", "0 0 0 rgba(0,200,0,0)"] 
          } : {}}
          transition={allDigitsUsed ? { repeat: Infinity, duration: 2 } : {}}
        >
          {allDigitsUsed ? "Solve!" : "Check"}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {gameCompleted && (
          <motion.div 
            className="bg-game-success/20 text-game-success p-3 rounded-lg text-center w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold">Great work! You solved it!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HectocBoard;
