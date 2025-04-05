import React, { useState } from 'react';
import GamePageTemplate from '@/components/multiplayer/GamePageTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Confetti from '@/components/Confetti';
import { RefreshCw, Zap, Trophy, Check, X } from 'lucide-react';

const CryptarithmeticGame: React.FC = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userSolution, setUserSolution] = useState<{[key: string]: string}>({});
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const puzzles = [
    {
      id: 1,
      equation: 'SEND + MORE = MONEY',
      uniqueLetters: ['S', 'E', 'N', 'D', 'M', 'O', 'R', 'Y'],
      solution: {S: '9', E: '5', N: '6', D: '7', M: '1', O: '0', R: '8', Y: '2'},
      hint: 'M must be 1 since it\'s the carry from S+M'
    },
    {
      id: 2,
      equation: 'TWO + TWO = FOUR',
      uniqueLetters: ['T', 'W', 'O', 'F', 'U', 'R'],
      solution: {T: '7', W: '3', O: '8', F: '1', U: '5', R: '6'},
      hint: 'F must be 1 since it\'s the carry from O+O'
    },
    {
      id: 3,
      equation: 'BASE + BALL = GAMES',
      uniqueLetters: ['B', 'A', 'S', 'E', 'L', 'G', 'M'],
      solution: {B: '2', A: '8', S: '7', E: '5', L: '1', G: '1', M: '0'},
      hint: 'Consider that G must be 1 as a carry'
    }
  ];

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleInputChange = (letter: string, value: string) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      setUserSolution({...userSolution, [letter]: value});
    }
  };

  const checkSolution = () => {
    const correct = currentPuzzle.uniqueLetters.every(
      letter => userSolution[letter] === currentPuzzle.solution[letter]
    );
    
    setIsCorrect(correct);
    setShowSolution(true);
    
    if (correct) {
      toast.success("Congratulations! Your solution is correct!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast.error("Not quite right. Check your solution and try again.");
    }
  };

  const resetPuzzle = () => {
    setUserSolution({});
    setShowSolution(false);
    setIsCorrect(false);
  };

  const nextPuzzle = () => {
    const nextIndex = (currentPuzzleIndex + 1) % puzzles.length;
    setCurrentPuzzleIndex(nextIndex);
    resetPuzzle();
  };

  const formatEquation = (equation: string, solution: {[key: string]: string}) => {
    return equation.split('').map((char, index) => {
      if (char === ' ' || char === '+' || char === '=') {
        return <span key={index} className="mx-1">{char}</span>;
      }
      
      const value = solution[char] || '';
      const isCorrect = showSolution ? 
        value === currentPuzzle.solution[char] : 
        undefined;
      
      return (
        <span 
          key={index} 
          className={`inline-block w-8 text-center font-mono ${
            showSolution && isCorrect !== undefined ? 
              (isCorrect ? 'text-green-400' : 'text-red-400') : 
              ''
          }`}
        >
          {char}
          {value && <sub className="ml-0.5">{value}</sub>}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <Confetti active={showConfetti} />
      
      <h2 className="text-2xl font-bold mb-4">Cryptarithmetic Puzzles</h2>
      <p className="text-muted-foreground mb-6">
        Solve cryptarithmetic puzzles where letters represent digits in a mathematical equation.
      </p>
      
      <motion.div 
        className="bg-black/30 p-6 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Puzzle #{currentPuzzleIndex + 1}</h3>
          
          <div className="text-center text-3xl mb-8 font-mono">
            {formatEquation(currentPuzzle.equation, userSolution)}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {currentPuzzle.uniqueLetters.map(letter => (
              <div key={letter} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted/50 rounded-md flex items-center justify-center font-mono">
                  {letter}
                </div>
                <Input 
                  value={userSolution[letter] || ''}
                  onChange={(e) => handleInputChange(letter, e.target.value)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-mono"
                  disabled={showSolution && isCorrect}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-muted/30 p-3 rounded-md text-sm">
            <span className="font-medium text-yellow-400">Hint:</span> {currentPuzzle.hint}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={checkSolution} 
            disabled={Object.keys(userSolution).length < currentPuzzle.uniqueLetters.length || showSolution}
            className="bg-primary hover:bg-primary/90 hover-scale"
          >
            <Check className="w-4 h-4 mr-2" />
            Check Solution
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetPuzzle}
            className="border-white/10 hover-scale"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={nextPuzzle}
            className="hover-scale"
          >
            <Zap className="w-4 h-4 mr-2" />
            Next Puzzle
          </Button>
        </div>
        
        {showSolution && (
          <motion.div 
            className={`mt-6 p-4 rounded-md ${isCorrect ? 'bg-green-900/20 border border-green-700/30' : 'bg-red-900/20 border border-red-700/30'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct Solution!' : 'Incorrect Solution'}
            </h4>
            
            <div className="grid grid-cols-4 gap-2">
              {currentPuzzle.uniqueLetters.map(letter => (
                <div key={letter} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted/30 rounded-md flex items-center justify-center font-mono">
                    {letter}
                  </div>
                  <div className="text-lg font-mono">
                    = {currentPuzzle.solution[letter]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const CryptarithmeticRules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">How to Play Cryptarithmetic</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">Game Objective</h3>
          <p>
            In Cryptarithmetic puzzles, letters represent digits in a mathematical equation. 
            Your goal is to determine which digit each letter represents to make the equation true.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Rules</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Each letter represents a unique digit (0-9).</li>
            <li>The first letter of any word cannot represent 0.</li>
            <li>The goal is to find a digit substitution that makes the equation valid.</li>
            <li>All standard mathematical rules apply to the equation.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Example</h3>
          <div className="p-4 bg-black/30 rounded-lg font-mono">
            <p className="text-center mb-2">SEND + MORE = MONEY</p>
            <p className="text-center">9567 + 1085 = 10652</p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              (where S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2)
            </p>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Tips for Success</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start with the rightmost column and work left.</li>
            <li>Look for letters that must represent specific digits based on carrying.</li>
            <li>Use the process of elimination.</li>
            <li>Check your solution in all columns to verify it works.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

const CryptarithmeticLeaderboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Cryptarithmetic Leaderboard</h2>
      
      <div className="flex flex-col">
        <div className="grid grid-cols-6 font-medium p-3 bg-black/40 rounded-t-lg">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Player</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-1 text-center">Puzzles</div>
          <div className="col-span-1 text-center">Avg Time</div>
        </div>
        
        {[
          { name: "CodeBreaker", score: 8765, puzzles: 32, avgTime: "2:15" },
          { name: "LetterMaster", score: 7654, puzzles: 28, avgTime: "2:45" },
          { name: "PuzzleSolver", score: 6543, puzzles: 25, avgTime: "3:10" },
          { name: "MathWizard", score: 5432, puzzles: 20, avgTime: "3:22" },
          { name: "LogicQueen", score: 4321, puzzles: 18, avgTime: "3:48" },
        ].map((player, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-6 p-3 ${
              index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'
            }`}
          >
            <div className="col-span-1 font-bold">{index + 1}</div>
            <div className="col-span-2">{player.name}</div>
            <div className="col-span-1 text-center font-mono">{player.score}</div>
            <div className="col-span-1 text-center">{player.puzzles}</div>
            <div className="col-span-1 text-center">{player.avgTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cryptarithmetic: React.FC = () => {
  return (
    <GamePageTemplate
      gameType="cryptarithmetic"
      title="Cryptarithmetic"
      subtitle="Solve puzzles where letters represent digits in mathematical equations"
      gameTitle="Cryptarithmetic"
      gameDescription="Decode letter-digit substitutions alone or challenge others in multiplayer mode!"
      singlePlayerComponent={<CryptarithmeticGame />}
      rulesComponent={<CryptarithmeticRules />}
      leaderboardComponent={<CryptarithmeticLeaderboard />}
    />
  );
};

export default Cryptarithmetic;
