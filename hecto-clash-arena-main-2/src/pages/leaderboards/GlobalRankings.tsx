
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Trophy, Medal, Search, ArrowUpDown, Users } from "lucide-react";

interface Player {
  id: number;
  name: string;
  rank: number;
  score: number;
  country: string;
  avatar: string;
  games: number;
  winRate: number;
}

// Mock data for the leaderboard
const generateMockPlayers = (count: number): Player[] => {
  const countries = ["USA", "UK", "Canada", "Australia", "Germany", "Japan", "India", "Brazil"];
  const names = [
    "MathWizard", "NumberNinja", "LogicMaster", "BrainTitan", "MathGenius",
    "QuickCalc", "MindMaster", "PuzzlePro", "ThinkTank", "MathMaven",
    "NumeralNerd", "LogicLegend", "BrainBox", "EquationAce", "MathMagician"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
    rank: i + 1,
    score: Math.floor(10000 * Math.random()) + 5000,
    country: countries[Math.floor(Math.random() * countries.length)],
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${i}`,
    games: Math.floor(Math.random() * 1000) + 100,
    winRate: Math.floor(Math.random() * 60) + 40
  })).sort((a, b) => b.score - a.score).map((player, index) => ({
    ...player,
    rank: index + 1
  }));
};

// Simulate different timeframes
const players = {
  daily: generateMockPlayers(50),
  weekly: generateMockPlayers(50),
  monthly: generateMockPlayers(50),
  allTime: generateMockPlayers(50)
};

const GlobalRankings: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"rank" | "score" | "games" | "winRate">("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  
  useEffect(() => {
    // Filter players based on search query
    const filtered = players[timeframe].filter(player => 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort players based on selected field and direction
    const sorted = [...filtered].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] - b[sortField];
      } else {
        return b[sortField] - a[sortField];
      }
    });
    
    setDisplayedPlayers(sorted);
  }, [timeframe, searchQuery, sortField, sortDirection]);
  
  const handleSort = (field: "rank" | "score" | "games" | "winRate") => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default direction
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const getRankStyle = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-muted-foreground";
  };
  
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">{rank}</span>;
  };
  
  return (
    <PageLayout 
      title="GLOBAL RANKINGS" 
      subtitle="SEE HOW YOU STACK UP AGAINST THE WORLD"
    >
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                Leaderboard
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search players..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Friends
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              defaultValue="weekly"
              onValueChange={(value) => setTimeframe(value as "daily" | "weekly" | "monthly" | "allTime")}
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="allTime">All Time</TabsTrigger>
              </TabsList>
              
              {["daily", "weekly", "monthly", "allTime"].map((period) => (
                <TabsContent key={period} value={period} className="m-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="px-4 py-2 text-left font-medium">Rank</th>
                          <th className="px-4 py-2 text-left font-medium">Player</th>
                          <th 
                            className="px-4 py-2 text-right font-medium cursor-pointer"
                            onClick={() => handleSort("score")}
                          >
                            <div className="flex items-center justify-end">
                              <span>Score</span>
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            className="px-4 py-2 text-right font-medium cursor-pointer hidden sm:table-cell"
                            onClick={() => handleSort("games")}
                          >
                            <div className="flex items-center justify-end">
                              <span>Games</span>
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </th>
                          <th 
                            className="px-4 py-2 text-right font-medium cursor-pointer hidden md:table-cell"
                            onClick={() => handleSort("winRate")}
                          >
                            <div className="flex items-center justify-end">
                              <span>Win Rate</span>
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedPlayers.slice(0, 20).map((player) => (
                          <tr key={player.id} className="border-b border-muted/20 hover:bg-muted/10">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {getMedalIcon(player.rank)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <img
                                  src={player.avatar}
                                  alt={player.name}
                                  className="w-8 h-8 rounded-full mr-3 bg-muted"
                                />
                                <div>
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-xs text-muted-foreground">{player.country}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold">
                              {player.score.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                              {player.games}
                            </td>
                            <td className="px-4 py-3 text-right hidden md:table-cell">
                              {player.winRate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {displayedPlayers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No players found matching your search.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="flex justify-between items-center pt-4 text-sm text-muted-foreground">
              <span>Showing top 20 players</span>
              <span>Updated 3 minutes ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GlobalRankings;
