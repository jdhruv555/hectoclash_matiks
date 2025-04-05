import React, { useEffect, useState } from 'react';
import { cleanupGameResources } from '@/utils/performance';
import { Skeleton } from '@/components/ui/skeleton';

interface GameWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onGameStart?: () => void;
  onGameEnd?: () => void;
  loading?: boolean;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({
  children,
  title,
  description,
  onGameStart,
  onGameEnd,
  loading = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clean up any existing game resources
    cleanupGameResources();

    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
      onGameStart?.();
    }, 500);

    return () => {
      clearTimeout(timer);
      onGameEnd?.();
      cleanupGameResources();
    };
  }, [onGameStart, onGameEnd]);

  if (loading || isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          {description && <Skeleton className="h-4 w-1/2 mx-auto" />}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}; 