
import React from "react";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/utils/gameLogic";

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  currentDifficulty, 
  onSelectDifficulty,
  disabled = false
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  const getColorByDifficulty = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 hover:bg-green-600';
      case 'medium': return 'bg-blue-500 hover:bg-blue-600';
      case 'hard': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'expert': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-game-primary hover:bg-game-primary/90';
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-center">SELECT DIFFICULTY</h3>
      <div className="grid grid-cols-2 gap-2">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty}
            onClick={() => onSelectDifficulty(difficulty)}
            className={`${
              currentDifficulty === difficulty 
                ? `${getColorByDifficulty(difficulty)} ring-2 ring-white` 
                : `bg-muted/30 hover:bg-muted/50`
            } capitalize transition-all duration-300`}
            disabled={disabled}
          >
            {difficulty}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
