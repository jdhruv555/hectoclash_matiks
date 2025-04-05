
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Skeleton } from "@/components/ui/skeleton";

// Math Games
import SpeedMath from "./pages/math-games/SpeedMath";
import NumberPuzzles from "./pages/math-games/NumberPuzzles";
import MathDuels from "./pages/math-games/MathDuels";
import VisualMathPuzzle from "./pages/math-games/VisualMathPuzzle";
import Cryptarithmetic from "./pages/math-games/Cryptarithmetic";

// Brain Teasers
import LogicPuzzles from "./pages/brain-teasers/LogicPuzzles";
import PatternRecognition from "./pages/brain-teasers/PatternRecognition";
import MemoryGames from "./pages/brain-teasers/MemoryGames";
import Riddles from "./pages/brain-teasers/Riddles";

// Learning
import Tutorials from "./pages/learning/Tutorials";
import Strategies from "./pages/learning/Strategies";
import MentalMath from "./pages/learning/MentalMath";
import InteractiveLessons from "./pages/learning/InteractiveLessons";
import AdvancedTopics from "./pages/learning/AdvancedTopics";

// Leaderboards
import GlobalRankings from "./pages/leaderboards/GlobalRankings";
import DailyChallenges from "./pages/leaderboards/DailyChallenges";
import PersonalStats from "./pages/leaderboards/PersonalStats";
import Achievements from "./pages/leaderboards/Achievements";

// Lazy loaded components
const CalculusQuest = lazy(() => import("./pages/math-games/CalculusQuest"));
const GeometryDash = lazy(() => import("./pages/math-games/GeometryDash"));
const FamousMathematicians = lazy(() => import("./pages/learning/FamousMathematicians"));

// Loading fallback
const LoadingFallback = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center p-8">
    <div className="w-full max-w-3xl space-y-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Math Games Routes */}
          <Route path="/math-games/hectoclash" element={<Index />} />
          <Route path="/math-games/speed-math" element={<SpeedMath />} />
          <Route path="/math-games/number-puzzles" element={<NumberPuzzles />} />
          <Route path="/math-games/math-duels" element={<MathDuels />} />
          <Route path="/math-games/calculus-quest" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalculusQuest />
            </Suspense>
          } />
          <Route path="/math-games/geometry-dash" element={
            <Suspense fallback={<LoadingFallback />}>
              <GeometryDash />
            </Suspense>
          } />
          <Route path="/math-games/visual-math-puzzle" element={<VisualMathPuzzle />} />
          <Route path="/math-games/cryptarithmetic" element={<Cryptarithmetic />} />
          
          {/* Brain Teasers Routes */}
          <Route path="/brain-teasers/logic-puzzles" element={<LogicPuzzles />} />
          <Route path="/brain-teasers/pattern-recognition" element={<PatternRecognition />} />
          <Route path="/brain-teasers/memory-games" element={<MemoryGames />} />
          <Route path="/brain-teasers/riddles" element={<Riddles />} />
          <Route path="/brain-teasers/visual-math-puzzle" element={<VisualMathPuzzle />} />
          <Route path="/brain-teasers/cryptarithmetic" element={<Cryptarithmetic />} />
          
          {/* Learning Routes */}
          <Route path="/learning/tutorials" element={<Tutorials />} />
          <Route path="/learning/strategies" element={<Strategies />} />
          <Route path="/learning/mental-math" element={<MentalMath />} />
          <Route path="/learning/interactive" element={<InteractiveLessons />} />
          <Route path="/learning/mathematicians" element={
            <Suspense fallback={<LoadingFallback />}>
              <FamousMathematicians />
            </Suspense>
          } />
          <Route path="/learning/advanced-topics" element={<AdvancedTopics />} />
          
          {/* Leaderboards Routes */}
          <Route path="/leaderboards/global" element={<GlobalRankings />} />
          <Route path="/leaderboards/daily" element={<DailyChallenges />} />
          <Route path="/leaderboards/stats" element={<PersonalStats />} />
          <Route path="/leaderboards/achievements" element={<Achievements />} />
          
          {/* Redirect old paths for compatibility */}
          <Route path="/math-sudoku" element={<Navigate to="/brain-teasers/logic-puzzles" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
