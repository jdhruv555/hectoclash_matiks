
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import MultiplayerGameWrapper from '@/components/multiplayer/MultiplayerGameWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MathDuels: React.FC = () => {
  const [activeTab, setActiveTab] = useState('multiplayer');

  const SinglePlayerComponent = () => (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Math Duels - Practice Mode</h2>
      
      <p className="text-muted-foreground mb-6">
        Practice your math skills before challenging other players.
        In practice mode, you can solve Hectoc puzzles at your own pace.
      </p>
      
      <p className="mb-6">
        Create a mathematical expression that equals exactly 100 using all 6 digits in the exact order they are given.
        You can use basic operations (+, -, ×, ÷), parentheses, and exponents.
      </p>
      
      <div className="bg-black/30 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Example:</h3>
        <p>For digits <strong>1 3 9 4 5 7</strong></p>
        <p>A valid solution could be: <strong>1 × 3 × (9 × 4 - 5) - 7 = 100</strong></p>
      </div>
      
      <p className="text-center text-muted-foreground">
        Switch to "Multiplayer" tab to challenge other players in real-time!
      </p>
    </div>
  );

  const HowToPlayComponent = () => (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">How to Play Math Duels</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">Game Objective</h3>
          <p>
            In Math Duels, you compete against another player to solve a Hectoc puzzle faster. 
            Each player receives the same sequence of 6 digits (1-9) and must use mathematical 
            operations to create an expression that equals exactly 100.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Rules</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Both players must use the given digits in the exact order they appear.</li>
            <li>You can use the operations: addition (+), subtraction (-), multiplication (×), division (÷), exponents (^), and parentheses ().</li>
            <li>The player who creates a valid expression equal to 100 first wins.</li>
            <li>If time runs out, the player who made more progress wins.</li>
            <li>Matches have a time limit based on difficulty (Easy: 90s, Medium: 60s, Hard: 45s, Expert: 30s).</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Game Modes</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">1. Quick Match</h4>
              <p className="text-muted-foreground">Join or create a match and play against a random opponent.</p>
            </div>
            <div>
              <h4 className="font-medium">2. Invite a Friend</h4>
              <p className="text-muted-foreground">Create a match and share the match ID with a friend to play together.</p>
            </div>
            <div>
              <h4 className="font-medium">3. Spectate</h4>
              <p className="text-muted-foreground">Watch ongoing matches to learn strategies and techniques.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Ranking System</h3>
          <p className="mb-2">
            Players are ranked based on their performance in matches. The ranking system uses an Elo-based algorithm:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Win: +25 rating points</li>
            <li>Loss: -15 rating points</li>
            <li>Minimum rating: 1000 points</li>
          </ul>
          <p className="mt-2">
            Players progress through ranks from Bronze to Diamond based on their rating.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Tips for Success</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Practice mental math to calculate faster.</li>
            <li>Learn to recognize patterns in numbers that can make 100.</li>
            <li>Master the strategic use of parentheses to group operations.</li>
            <li>Remember the order of operations (PEMDAS) when creating expressions.</li>
            <li>Start with easier difficulties and progressively challenge yourself.</li>
          </ul>
        </section>
      </div>
    </div>
  );

  const LeaderboardComponent = () => (
    <div className="max-w-4xl mx-auto p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Global Rankings</h2>
      
      <p className="text-muted-foreground mb-6">
        Rankings are updated in real-time based on player performance. Win matches to climb the leaderboard!
      </p>
      
      <div className="flex flex-col">
        <div className="grid grid-cols-6 font-medium p-3 bg-black/40 rounded-t-lg">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Player</div>
          <div className="col-span-1 text-center">Rating</div>
          <div className="col-span-1 text-center">W/L</div>
          <div className="col-span-1 text-center">Win Rate</div>
        </div>
        
        {[
          { id: 1, name: "MathWhiz", rank: "Diamond III", rating: 2457, wins: 187, losses: 42, winRate: 82 },
          { id: 2, name: "NumberNinja", rank: "Diamond II", rating: 2389, wins: 165, losses: 53, winRate: 76 },
          { id: 3, name: "PuzzleMaster", rank: "Diamond I", rating: 2301, wins: 143, losses: 59, winRate: 71 },
          { id: 4, name: "QuickCalc", rank: "Platinum III", rating: 2198, wins: 124, losses: 63, winRate: 66 },
          { id: 5, name: "LogicLegend", rank: "Platinum II", rating: 2087, wins: 118, losses: 70, winRate: 63 },
          { id: 6, name: "BrainiacX", rank: "Platinum I", rating: 1956, wins: 98, losses: 65, winRate: 60 },
          { id: 7, name: "MathematicalMind", rank: "Gold III", rating: 1873, wins: 87, losses: 73, winRate: 54 },
          { id: 8, name: "AlgebraAce", rank: "Gold II", rating: 1752, wins: 76, losses: 81, winRate: 48 },
          { id: 9, name: "NumberCruncher", rank: "Gold I", rating: 1689, wins: 64, losses: 77, winRate: 45 },
          { id: 10, name: "EquationExpert", rank: "Silver III", rating: 1543, wins: 53, losses: 82, winRate: 39 },
        ].map((player, index) => (
          <div 
            key={player.id} 
            className={`grid grid-cols-6 p-3 ${
              index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'
            } ${index === 0 ? 'bg-yellow-900/30' : ''}`}
          >
            <div className="col-span-1 font-bold">{index + 1}</div>
            <div className="col-span-2">
              <div>{player.name}</div>
              <div className="text-sm text-muted-foreground">{player.rank}</div>
            </div>
            <div className="col-span-1 text-center font-mono">{player.rating}</div>
            <div className="col-span-1 text-center">{player.wins}/{player.losses}</div>
            <div className="col-span-1 text-center font-medium">{player.winRate}%</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Note: Rankings are updated immediately after each match. Inactive players may decay in rank over time.</p>
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Math Duels"
      subtitle="Challenge other players in real-time mathematical duels"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
          <TabsTrigger value="leaderboards">Rankings</TabsTrigger>
          <TabsTrigger value="how-to-play">How to Play</TabsTrigger>
        </TabsList>
        
        <TabsContent value="multiplayer">
          <MultiplayerGameWrapper
            gameType="math-duel"
            singlePlayerComponent={<SinglePlayerComponent />}
            gameTitle="Math Duels"
            gameDescription="Challenge other players to mathematical duels or watch live matches!"
          />
        </TabsContent>
        
        <TabsContent value="leaderboards">
          <LeaderboardComponent />
        </TabsContent>
        
        <TabsContent value="how-to-play">
          <HowToPlayComponent />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default MathDuels;
