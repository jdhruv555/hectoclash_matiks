
import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion for animations

interface OperatorButtonProps {
  operator: string;
  onClick: () => void;
  disabled?: boolean;
  multiplayer?: boolean;
  isActive?: boolean;
}

const OperatorButton: React.FC<OperatorButtonProps> = ({ 
  operator, 
  onClick, 
  disabled = false,
  multiplayer = false,
  isActive = false
}) => {
  // Determine operator colors based on type
  const getOperatorClass = () => {
    switch (operator) {
      case '+':
        return 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700';
      case '-':
        return 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700';
      case '×':
      case '*':
        return 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700';
      case '÷':
      case '/':
        return 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700';
      case '(':
      case ')':
        return 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700';
      case '^':
        return 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700';
      case '⌫':
        return 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700';
      default:
        return 'bg-game-primary hover:bg-game-primary/90 active:bg-game-primary/80';
    }
  };
  
  // Add tactile animation properties with multiplayer enhancement
  const buttonVariants = {
    rest: { 
      scale: 1, 
      boxShadow: "0 4px 0 0 rgba(0,0,0,0.2)"
    },
    hover: { 
      scale: 1.05, 
      y: -2,
      boxShadow: "0 6px 0 0 rgba(0,0,0,0.2)"
    },
    tap: { 
      scale: 0.95, 
      y: 2,
      boxShadow: "0 2px 0 0 rgba(0,0,0,0.2)"
    },
    active: {
      scale: 1.1,
      boxShadow: "0 0 8px 2px rgba(255,255,255,0.7)",
      transition: { duration: 0.2 }
    }
  };

  // Additional class for multiplayer mode
  const multiplayerClass = multiplayer 
    ? "transition-all duration-300 transform-gpu" 
    : "";

  // Pulse animation for active multiplayer state
  const pulseAnimation = isActive && multiplayer
    ? "animate-pulse ring-2 ring-white ring-opacity-70" 
    : "";

  return (
    <motion.button
      className={`flex items-center justify-center ${getOperatorClass()} text-white font-bold rounded-md w-full h-12 shadow-md transition-all duration-200 text-xl ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${multiplayerClass} ${pulseAnimation}`}
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      initial="rest"
      animate={isActive ? "active" : "rest"}
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {operator}
      {multiplayer && isActive && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
    </motion.button>
  );
};

export default OperatorButton;
