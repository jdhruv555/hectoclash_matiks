import React from "react";
import TopNavigation from "./TopNavigation";
import { Progress } from "@/components/ui/progress";
import Footer from "./Footer"; // Import Footer component

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showProgress?: boolean;
  progressValue?: number;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  showProgress = false,
  progressValue = 0,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-game-bg text-game-text">
      <TopNavigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-game-text">{title}</h1>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          
          {showProgress && (
            <div className="mt-4 max-w-xl mx-auto">
              <Progress value={progressValue} className="h-2 bg-muted/30" />
              <p className="text-sm text-muted-foreground mt-1">
                Progress: {Math.round(progressValue)}%
              </p>
            </div>
          )}
        </header>
        
        <main className="relative z-10">{children}</main>
      </div>
      
      <Footer /> {/* Add Footer component to ensure it appears on every page */}
    </div>
  );
};

export default PageLayout;
