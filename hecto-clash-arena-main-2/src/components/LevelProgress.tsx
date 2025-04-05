
import React from "react";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/utils/gameLogic";
import { Trophy, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LevelProgressProps {
  level: number;
  difficulty: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, difficulty }) => {
  const progress = calculateProgress(level);
  
  // Get color based on difficulty
  const getColorByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-blue-500';
      case 'hard': return 'bg-yellow-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-game-primary';
    }
  };
  
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'hard': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'expert': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    }
  };
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black flex items-center justify-center text-xs font-bold border border-amber-400/50">
              {level}
            </div>
          </div>
          <div>
            <span className="font-gaming text-lg tracking-wide text-gradient-gold">LEVEL {level}</span>
            {level >= 10 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="text-xs text-amber-400">Master Status</span>
              </div>
            )}
          </div>
        </div>
        
        <Badge className={`px-3 py-1 font-bold uppercase ${getDifficultyClass(difficulty)}`}>
          {difficulty}
        </Badge>
      </div>
      
      <div className="game-progress">
        <div 
          className={`game-progress-bar ${getColorByDifficulty(difficulty)}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-xs mt-1">
        <span className="text-game-muted-text">Progress</span>
        <span className="font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default LevelProgress;
