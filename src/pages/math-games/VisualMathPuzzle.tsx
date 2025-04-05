import React from 'react';
import PageLayout from '@/components/PageLayout';

const VisualMathPuzzle: React.FC = () => {
  return (
    <PageLayout
      title="Visual Math Puzzles"
      subtitle="Solve mathematical puzzles using visual patterns"
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            This game is currently under development. Get ready for exciting visual math puzzles!
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default VisualMathPuzzle;
