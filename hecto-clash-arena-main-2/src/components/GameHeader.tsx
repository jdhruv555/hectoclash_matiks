
import React from "react";
import { Trophy, Star, Award, Flame, Zap } from "lucide-react";
import GameRules from "./GameRules";
import { Badge } from "@/components/ui/badge";

interface GameHeaderProps {
  score: number;
  level: number;
  puzzlesSolved: number;
  streakCount: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  level, 
  puzzlesSolved, 
  streakCount 
}) => {
  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in">
      <h1 className="text-5xl font-extrabold text-center tracking-tighter pb-2 uppercase">
        <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
          HECTOCLASH
        </span>
        <span className="text-white"> ARENA</span>
      </h1>
      <p className="text-lg text-game-muted-text mb-6 font-medium tracking-wide">MASTER THE NUMBERS, UNLEASH YOUR POTENTIAL</p>
      
      <div className="flex items-center justify-between w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 scoreboard">
        <div className="flex items-center gap-3">
          <div className="bg-black/40 rounded-full p-3 border border-amber-500/30 glow-red">
            <Trophy className="text-amber-400 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-xs text-game-muted-text uppercase tracking-wider">POINTS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-black/40 rounded-full p-3 border border-blue-500/30">
            <Star className="text-blue-400 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{level}</span>
            <span className="text-xs text-game-muted-text uppercase tracking-wider">LEVEL</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-black/40 rounded-full p-3 border border-green-500/30">
            <Award className="text-green-400 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{puzzlesSolved}</span>
            <span className="text-xs text-game-muted-text uppercase tracking-wider">SOLVED</span>
          </div>
        </div>
        
        <GameRules />
      </div>
      
      {streakCount > 1 && (
        <div className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-red-500/30 rounded-full flex items-center gap-2 animate-pulse border border-amber-500/30">
          <Flame className="h-5 w-5 text-amber-400" />
          <span className="text-amber-400 font-bold">{streakCount} Streak!</span>
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 text-sm">Keep it going!</span>
        </div>
      )}
    </div>
  );
};

export default GameHeader;
