
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, Trophy, Star, Clock, Brain, Zap, Target, 
  Flame, Medal, BookOpen, Sparkles, Crown
} from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'beginner' | 'intermediate' | 'advanced' | 'math' | 'speed' | 'streak';
  progress: number;
  maxProgress: number;
  completed: boolean;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Achievements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  
  const achievements: Achievement[] = [
    // Beginner achievements
    {
      id: "first-challenge",
      title: "First Steps",
      description: "Complete your first challenge",
      icon: <Award />,
      category: 'beginner',
      progress: 1,
      maxProgress: 1,
      completed: true,
      points: 10,
      rarity: 'common'
    },
    {
      id: "math-novice",
      title: "Math Novice",
      description: "Complete 5 math challenges",
      icon: <BookOpen />,
      category: 'beginner',
      progress: 5,
      maxProgress: 5,
      completed: true,
      points: 20,
      rarity: 'common'
    },
    {
      id: "level-up",
      title: "Level Up",
      description: "Reach level 5",
      icon: <Star />,
      category: 'beginner',
      progress: 5,
      maxProgress: 5,
      completed: true,
      points: 25,
      rarity: 'common'
    },
    
    // Intermediate achievements
    {
      id: "problem-solver",
      title: "Problem Solver",
      description: "Complete 25 challenges",
      icon: <Brain />,
      category: 'intermediate',
      progress: 18,
      maxProgress: 25,
      completed: false,
      points: 50,
      rarity: 'rare'
    },
    {
      id: "winning-streak",
      title: "Winning Streak",
      description: "Solve 10 challenges in a row without errors",
      icon: <Flame />,
      category: 'intermediate',
      progress: 6,
      maxProgress: 10,
      completed: false,
      points: 75,
      rarity: 'rare'
    },
    {
      id: "daily-devotion",
      title: "Daily Devotion",
      description: "Log in for 7 consecutive days",
      icon: <Medal />,
      category: 'streak',
      progress: 7,
      maxProgress: 7,
      completed: true,
      points: 30,
      rarity: 'rare'
    },
    
    // Advanced achievements
    {
      id: "math-wizard",
      title: "Math Wizard",
      description: "Complete 100 challenges",
      icon: <Trophy />,
      category: 'advanced',
      progress: 42,
      maxProgress: 100,
      completed: false,
      points: 150,
      rarity: 'epic'
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Complete 5 hard challenges in under 30 seconds each",
      icon: <Zap />,
      category: 'speed',
      progress: 2,
      maxProgress: 5,
      completed: false,
      points: 100,
      rarity: 'epic'
    },
    {
      id: "perfect-score",
      title: "Perfect Score",
      description: "Get 100% accuracy in 10 daily challenges",
      icon: <Target />,
      category: 'advanced',
      progress: 4,
      maxProgress: 10,
      completed: false,
      points: 125,
      rarity: 'epic'
    },
    
    // Legendary achievements
    {
      id: "math-legend",
      title: "Math Legend",
      description: "Complete all challenges with at least 90% accuracy",
      icon: <Star />,
      category: 'math',
      progress: 28,
      maxProgress: 50,
      completed: false,
      points: 300,
      rarity: 'legendary'
    },
    {
      id: "dedication",
      title: "Ultimate Dedication",
      description: "Maintain a login streak of 30 days",
      icon: <Flame />,
      category: 'streak',
      progress: 12,
      maxProgress: 30,
      completed: false,
      points: 250,
      rarity: 'legendary'
    },
    {
      id: "time-master",
      title: "Time Master",
      description: "Complete 20 challenges with at least 50% of the time remaining",
      icon: <Clock />,
      category: 'speed',
      progress: 8,
      maxProgress: 20,
      completed: false,
      points: 200,
      rarity: 'legendary'
    }
  ];
  
  // Add animation effect when viewing achievements
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const animateAchievements = () => {
      achievements.forEach((_, index) => {
        timer = setTimeout(() => {
          setAnimateIndex(index);
          setTimeout(() => setAnimateIndex(null), 600);
        }, index * 100);
      });
    };
    
    animateAchievements();
    
    return () => {
      clearTimeout(timer);
    };
  }, [activeTab]);
  
  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeTab);
  
  const completedCount = achievements.filter(a => a.completed).length;
  const totalPoints = achievements.reduce((sum, a) => a.completed ? sum + a.points : sum, 0);
  const allPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-300 bg-gradient-to-br from-slate-100/10 to-slate-200/10 text-slate-300';
      case 'rare': return 'border-blue-300 bg-gradient-to-br from-blue-100/10 to-blue-300/10 text-blue-300';
      case 'epic': return 'border-purple-300 bg-gradient-to-br from-purple-100/10 to-purple-300/10 text-purple-300';
      case 'legendary': return 'border-amber-300 bg-gradient-to-br from-amber-100/10 to-amber-300/10 text-amber-300';
      default: return 'border-slate-300 bg-gradient-to-br from-slate-100/10 to-slate-200/10 text-slate-300';
    }
  };
  
  const getIconColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };
  
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '';
      case 'rare': return 'shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'epic': return 'shadow-[0_0_15px_rgba(147,51,234,0.4)]';
      case 'legendary': return 'shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse';
      default: return '';
    }
  };
  
  const handleShare = (achievement: Achievement) => {
    toast.success(`Shared: ${achievement.title} achievement`);
  };
  
  return (
    <PageLayout 
      title="Achievements" 
      subtitle="Unlock achievements and earn points by completing challenges"
      showProgress
      progressValue={(completedCount / achievements.length) * 100}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent inline-flex items-center gap-2">
            <Trophy />
            ACHIEVEMENT HALL
          </h1>
          <p className="text-lg text-muted-foreground">Showcase your accomplishments and earn bragging rights!</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-500/30 text-amber-300 px-4 py-3 rounded-xl font-medium flex items-center gap-2 border border-amber-500/30 shadow-lg">
              <Trophy size={22} className="text-amber-400" />
              <div>
                <span className="block text-2xl font-bold">{completedCount}/{achievements.length}</span>
                <span className="text-xs text-amber-300/80">Achievements Unlocked</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/50 to-purple-500/30 text-purple-300 px-4 py-3 rounded-xl font-medium flex items-center gap-2 border border-purple-500/30 shadow-lg">
              <Award size={22} className="text-purple-400" />
              <div>
                <span className="block text-2xl font-bold">{totalPoints}/{allPoints}</span>
                <span className="text-xs text-purple-300/80">Total Points Earned</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Overall Completion</span>
              <span className="text-xs font-bold">{((completedCount / achievements.length) * 100).toFixed(0)}%</span>
            </div>
            <div className="game-progress">
              <div
                className="game-progress-bar bg-gradient-to-r from-amber-500 to-amber-400"
                style={{ width: `${(completedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="all" className="font-gaming">All</TabsTrigger>
            <TabsTrigger value="beginner" className="font-gaming">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" className="font-gaming">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced" className="font-gaming">Advanced</TabsTrigger>
            <TabsTrigger value="math" className="font-gaming">Math</TabsTrigger>
            <TabsTrigger value="speed" className="font-gaming">Speed</TabsTrigger>
            <TabsTrigger value="streak" className="font-gaming">Streaks</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredAchievements.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Award size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No achievements in this category</h3>
                <p className="text-muted-foreground">Try another category or keep playing to unlock more achievements!</p>
              </div>
            ) : (
              filteredAchievements.map((achievement, index) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 border-2 ${
                    achievement.completed 
                      ? 'border-l-green-500 bg-gradient-to-br from-green-900/10 to-green-800/5'
                      : 'border-l-muted bg-gradient-to-br from-gray-900/50 to-black/50'
                  } ${getRarityGlow(achievement.rarity)} ${animateIndex === index ? 'achievement-earned' : ''} transform hover:scale-[1.01] transition-all duration-200`}
                >
                  <div className="flex gap-4">
                    <div className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)}`}>
                      <div className={getIconColor(achievement.rarity)}>
                        {achievement.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {achievement.title}
                            {achievement.completed && (
                              <Sparkles size={16} className="text-amber-400" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-black/30 px-2 py-1 rounded-md border border-white/10">
                          <Trophy size={14} className="text-amber-400" />
                          <span className="font-bold">{achievement.points} pts</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`border ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {achievement.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-medium">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                          {achievement.completed && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleShare(achievement)}
                              className="h-7 text-xs"
                            >
                              Share
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="game-progress h-2">
                        <div 
                          className={`h-full rounded ${
                            achievement.completed 
                              ? 'bg-gradient-to-r from-green-500 to-green-400' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-400'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="p-6 bg-gradient-to-br from-black/80 to-gray-900/80 border-2 border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="text-amber-400 h-6 w-6" />
            <h2 className="text-xl font-bold">Achievement Statistics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Common", count: achievements.filter(a => a.rarity === 'common').length, color: 'from-slate-800/50 to-slate-900/50 border-slate-700/50' },
              { label: "Rare", count: achievements.filter(a => a.rarity === 'rare').length, color: 'from-blue-800/50 to-blue-900/50 border-blue-700/50' },
              { label: "Epic", count: achievements.filter(a => a.rarity === 'epic').length, color: 'from-purple-800/50 to-purple-900/50 border-purple-700/50' },
              { label: "Legendary", count: achievements.filter(a => a.rarity === 'legendary').length, color: 'from-amber-800/50 to-amber-900/50 border-amber-700/50 shadow-[0_0_10px_rgba(251,191,36,0.25)]' }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 text-center border border-white/5 hover:scale-105 transition-transform duration-200`}>
                <div className="text-3xl font-bold">{stat.count}</div>
                <div className="text-xs font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Unlock More Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Unlock more achievements by completing challenges, maintaining streaks, and improving your math skills.
              Legendary achievements offer the highest point rewards!
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="game" size="sm" className="gap-1">
                <Zap className="h-4 w-4" />
                Daily Challenges
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Flame className="h-4 w-4" />
                Maintain Streaks
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Brain className="h-4 w-4" />
                Master New Skills
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Achievements;
