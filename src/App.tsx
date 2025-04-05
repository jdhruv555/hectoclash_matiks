import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Math Games
const SpeedMath = lazy(() => import("./pages/math-games/SpeedMath"));
const NumberPuzzles = lazy(() => import("./pages/math-games/NumberPuzzles"));
const MathDuels = lazy(() => import("./pages/math-games/MathDuels"));
const VisualMathPuzzle = lazy(() => import("./pages/math-games/VisualMathPuzzle"));
const Cryptarithmetic = lazy(() => import("./pages/math-games/Cryptarithmetic"));
const CalculusQuest = lazy(() => import("./pages/math-games/CalculusQuest"));
const GeometryDash = lazy(() => import("./pages/math-games/GeometryDash"));

// Brain Teasers
const LogicPuzzles = lazy(() => import("./pages/brain-teasers/LogicPuzzles"));
const PatternRecognition = lazy(() => import("./pages/brain-teasers/PatternRecognition"));
const MemoryGames = lazy(() => import("./pages/brain-teasers/MemoryGames"));
const Riddles = lazy(() => import("./pages/brain-teasers/Riddles"));

// Learning
const Tutorials = lazy(() => import("./pages/learning/Tutorials"));
const Strategies = lazy(() => import("./pages/learning/Strategies"));
const MentalMath = lazy(() => import("./pages/learning/MentalMath"));
const InteractiveLessons = lazy(() => import("./pages/learning/InteractiveLessons"));
const AdvancedTopics = lazy(() => import("./pages/learning/AdvancedTopics"));
const FamousMathematicians = lazy(() => import("./pages/learning/FamousMathematicians"));

// Leaderboards
const GlobalRankings = lazy(() => import("./pages/leaderboards/GlobalRankings"));
const DailyChallenges = lazy(() => import("./pages/leaderboards/DailyChallenges"));
const PersonalStats = lazy(() => import("./pages/leaderboards/PersonalStats"));
const Achievements = lazy(() => import("./pages/leaderboards/Achievements"));

// Loading fallback with better UI
const LoadingFallback = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center p-8 bg-background">
    <div className="w-full max-w-3xl space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Skeleton className="h-4 w-1/4 mx-auto" />
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
          <Route path="/" element={
            <Suspense fallback={<LoadingFallback />}>
              <Index />
            </Suspense>
          } />
          
          {/* Math Games Routes */}
          <Route path="/math-games/hectoclash" element={
            <Suspense fallback={<LoadingFallback />}>
              <Index />
            </Suspense>
          } />
          <Route path="/math-games/speed-math" element={
            <Suspense fallback={<LoadingFallback />}>
              <SpeedMath />
            </Suspense>
          } />
          <Route path="/math-games/number-puzzles" element={
            <Suspense fallback={<LoadingFallback />}>
              <NumberPuzzles />
            </Suspense>
          } />
          <Route path="/math-games/math-duels" element={
            <Suspense fallback={<LoadingFallback />}>
              <MathDuels />
            </Suspense>
          } />
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
          <Route path="/math-games/visual-math-puzzle" element={
            <Suspense fallback={<LoadingFallback />}>
              <VisualMathPuzzle />
            </Suspense>
          } />
          <Route path="/math-games/cryptarithmetic" element={
            <Suspense fallback={<LoadingFallback />}>
              <Cryptarithmetic />
            </Suspense>
          } />
          
          {/* Brain Teasers Routes */}
          <Route path="/brain-teasers/logic-puzzles" element={
            <Suspense fallback={<LoadingFallback />}>
              <LogicPuzzles />
            </Suspense>
          } />
          <Route path="/brain-teasers/pattern-recognition" element={
            <Suspense fallback={<LoadingFallback />}>
              <PatternRecognition />
            </Suspense>
          } />
          <Route path="/brain-teasers/memory-games" element={
            <Suspense fallback={<LoadingFallback />}>
              <MemoryGames />
            </Suspense>
          } />
          <Route path="/brain-teasers/riddles" element={
            <Suspense fallback={<LoadingFallback />}>
              <Riddles />
            </Suspense>
          } />
          
          {/* Learning Routes */}
          <Route path="/learning/tutorials" element={
            <Suspense fallback={<LoadingFallback />}>
              <Tutorials />
            </Suspense>
          } />
          <Route path="/learning/strategies" element={
            <Suspense fallback={<LoadingFallback />}>
              <Strategies />
            </Suspense>
          } />
          <Route path="/learning/mental-math" element={
            <Suspense fallback={<LoadingFallback />}>
              <MentalMath />
            </Suspense>
          } />
          <Route path="/learning/interactive" element={
            <Suspense fallback={<LoadingFallback />}>
              <InteractiveLessons />
            </Suspense>
          } />
          <Route path="/learning/mathematicians" element={
            <Suspense fallback={<LoadingFallback />}>
              <FamousMathematicians />
            </Suspense>
          } />
          <Route path="/learning/advanced-topics" element={
            <Suspense fallback={<LoadingFallback />}>
              <AdvancedTopics />
            </Suspense>
          } />
          
          {/* Leaderboards Routes */}
          <Route path="/leaderboards/global" element={
            <Suspense fallback={<LoadingFallback />}>
              <GlobalRankings />
            </Suspense>
          } />
          <Route path="/leaderboards/daily" element={
            <Suspense fallback={<LoadingFallback />}>
              <DailyChallenges />
            </Suspense>
          } />
          <Route path="/leaderboards/stats" element={
            <Suspense fallback={<LoadingFallback />}>
              <PersonalStats />
            </Suspense>
          } />
          <Route path="/leaderboards/achievements" element={
            <Suspense fallback={<LoadingFallback />}>
              <Achievements />
            </Suspense>
          } />
          
          {/* Redirect old paths for compatibility */}
          <Route path="/math-sudoku" element={<Navigate to="/brain-teasers/logic-puzzles" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
