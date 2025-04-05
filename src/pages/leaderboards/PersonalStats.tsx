
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { 
  Trophy, Clock, Brain, Target, Award, 
  Calendar, ArrowUp, ArrowDown, Flame 
} from "lucide-react";

const PersonalStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("progress");
  
  // Sample data for demonstration
  const progressData = [
    { day: "Mon", score: 120 },
    { day: "Tue", score: 180 },
    { day: "Wed", score: 150 },
    { day: "Thu", score: 220 },
    { day: "Fri", score: 280 },
    { day: "Sat", score: 350 },
    { day: "Sun", score: 310 }
  ];
  
  const categoryData = [
    { name: "Arithmetic", value: 42 },
    { name: "Algebra", value: 28 },
    { name: "Geometry", value: 15 },
    { name: "Probability", value: 8 },
    { name: "Statistics", value: 7 }
  ];
  
  const accuracyData = [
    { day: "1", accuracy: 70 },
    { day: "2", accuracy: 75 },
    { day: "3", accuracy: 82 },
    { day: "4", accuracy: 78 },
    { day: "5", accuracy: 84 },
    { day: "6", accuracy: 90 },
    { day: "7", accuracy: 88 }
  ];
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];
  
  const StatCard = ({ title, value, icon, trend, color }: { 
    title: string, 
    value: string, 
    icon: React.ReactNode,
    trend?: { value: string, up: boolean },
    color?: string
  }) => (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <div className={`flex items-center text-xs mt-1 ${
              trend.up ? 'text-green-600' : 'text-red-500'
            }`}>
              {trend.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-2 rounded-md ${color || 'bg-blue-100'}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
  
  return (
    <PageLayout 
      title="Personal Statistics" 
      subtitle="Track your learning progress and performance"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Score" 
            value="1,845" 
            icon={<Trophy className="text-amber-600" size={20} />}
            trend={{ value: "12% this week", up: true }}
            color="bg-amber-100"
          />
          <StatCard 
            title="Challenges Completed" 
            value="37" 
            icon={<Target className="text-emerald-600" size={20} />}
            trend={{ value: "4 this week", up: true }}
            color="bg-emerald-100"
          />
          <StatCard 
            title="Avg. Accuracy" 
            value="84%" 
            icon={<Brain className="text-purple-600" size={20} />}
            trend={{ value: "3% this week", up: true }}
            color="bg-purple-100"
          />
          <StatCard 
            title="Avg. Solve Time" 
            value="1:24" 
            icon={<Clock className="text-blue-600" size={20} />}
            trend={{ value: "7% this week", up: false }}
            color="bg-blue-100"
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <Calendar size={14} />
              Progress
            </TabsTrigger>
            <TabsTrigger value="strengths" className="flex items-center gap-1">
              <Award size={14} />
              Strengths
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex items-center gap-1">
              <Target size={14} />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex items-center gap-1">
              <Flame size={14} />
              Streak
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Weekly Score Progress</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Your score has been steadily increasing over the past week. Keep up the good work!
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="strengths">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Strengths by Category</h2>
              <div className="h-[300px] w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="accuracy">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Answer Accuracy Trend</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Your accuracy has improved from 70% to 88% over the past week, showing significant progress in problem-solving skills.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="streak">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Activity Streak</h2>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mb-4">
                  <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                    <Flame className="text-amber-500 mb-1" size={24} />
                    <span className="text-3xl font-bold">12</span>
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Current Streak</h3>
                <p className="text-sm text-muted-foreground mb-6">You've been active for 12 days in a row!</p>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 14 }).map((_, index) => {
                    const isActive = index < 12;
                    return (
                      <div 
                        key={index} 
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium ${
                          isActive 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isActive && <Flame size={14} className="text-amber-500" />}
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-sm text-center max-w-md">
                  Maintain your streak by completing at least one challenge every day. 
                  Your longest streak is <span className="font-medium">15 days</span>.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent Achievements</h2>
            <div className="space-y-4">
              {[
                { icon: <Award className="text-amber-500" />, title: "Math Wizard", desc: "Complete 30 challenges", date: "2 days ago" },
                { icon: <Flame className="text-red-500" />, title: "On Fire", desc: "Maintain a 10-day streak", date: "4 days ago" },
                { icon: <Clock className="text-blue-500" />, title: "Speed Demon", desc: "Solve a hard challenge in under 45 seconds", date: "1 week ago" }
              ].map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-md">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{achievement.date}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Areas for Improvement</h2>
            <div className="space-y-4">
              {[
                { name: "Probability", progress: 32 },
                { name: "Statistics", progress: 45 },
                { name: "Trigonometry", progress: 28 }
              ].map((area, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{area.name}</span>
                    <span className="text-muted-foreground">{area.progress}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${area.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-2">
                Focus on these areas to improve your overall math skills and increase your score.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default PersonalStats;
