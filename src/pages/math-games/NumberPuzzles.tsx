import React from 'react';
import GamePageTemplate from '@/components/multiplayer/GamePageTemplate';
import { Card } from '@/components/ui/card';

const NumberPuzzlesGame: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Number Puzzles</h2>
      <p className="text-muted-foreground mb-6">
        Solve challenging number puzzles to test your mathematical skills.
      </p>
      <div className="bg-black/30 p-6 rounded-lg">
        <p className="text-center text-xl">Number Puzzles Game Content</p>
      </div>
    </div>
  );
};

const NumberPuzzlesRules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">How to Play Number Puzzles</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">Game Objective</h3>
          <p>
            In Number Puzzles, your goal is to solve mathematical puzzles using logic and arithmetic.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Rules</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Each puzzle presents you with a set of numbers and operations.</li>
            <li>You must arrange them to create a valid mathematical expression.</li>
            <li>Complete puzzles within the time limit to earn points.</li>
            <li>More challenging puzzles award more points.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Tips for Success</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Start with the simplest operations first.</li>
            <li>Pay attention to the order of operations (PEMDAS).</li>
            <li>Look for patterns in the numbers.</li>
            <li>Practice mental math to solve puzzles faster.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

const NumberPuzzlesLeaderboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Number Puzzles Leaderboard</h2>
      
      <div className="flex flex-col">
        <div className="grid grid-cols-6 font-medium p-3 bg-black/40 rounded-t-lg">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Player</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-1 text-center">Puzzles</div>
          <div className="col-span-1 text-center">Avg Time</div>
        </div>
        
        {[
          { name: "NumberMaster", score: 9876, puzzles: 43, avgTime: "1:23" },
          { name: "PuzzleKing", score: 8765, puzzles: 38, avgTime: "1:45" },
          { name: "MathGenius", score: 7654, puzzles: 35, avgTime: "1:58" },
          { name: "LogicQueen", score: 6543, puzzles: 29, avgTime: "2:05" },
          { name: "BrainTitan", score: 5432, puzzles: 25, avgTime: "2:12" },
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

const NumberPuzzles: React.FC = () => {
  return (
    <GamePageTemplate
      gameType="number-puzzle"
      title="Number Puzzles"
      subtitle="Challenge your mathematical skills with number puzzles"
      gameTitle="Number Puzzles"
      gameDescription="Solve number puzzles alone or challenge others in multiplayer mode!"
      singlePlayerComponent={<NumberPuzzlesGame />}
      rulesComponent={<NumberPuzzlesRules />}
      leaderboardComponent={<NumberPuzzlesLeaderboard />}
    />
  );
};

export default NumberPuzzles;
