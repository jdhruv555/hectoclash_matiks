
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { MultiplayerProvider } from '@/contexts/MultiplayerContext';
import MultiplayerGameWrapper from '@/components/multiplayer/MultiplayerGameWrapper';
import { GameType } from '@/contexts/MultiplayerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GamePageTemplateProps {
  gameType: GameType;
  title: string;
  subtitle: string;
  gameTitle: string;
  gameDescription: string;
  singlePlayerComponent: React.ReactNode;
  rulesComponent?: React.ReactNode;
  leaderboardComponent?: React.ReactNode;
}

const GamePageTemplate: React.FC<GamePageTemplateProps> = ({
  gameType,
  title,
  subtitle,
  gameTitle,
  gameDescription,
  singlePlayerComponent,
  rulesComponent,
  leaderboardComponent
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('game');

  // Calculate number of tabs to adjust grid columns
  const tabCount = 1 + (rulesComponent ? 1 : 0) + (leaderboardComponent ? 1 : 0);
  const tabsGridClass = `grid grid-cols-${tabCount} mb-8`;

  return (
    <PageLayout title={title} subtitle={subtitle}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className={`grid grid-cols-${tabCount} mb-8`}>
          <TabsTrigger value="game">Play Game</TabsTrigger>
          {leaderboardComponent && <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>}
          {rulesComponent && <TabsTrigger value="rules">How to Play</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="game">
          <MultiplayerProvider>
            <MultiplayerGameWrapper
              gameType={gameType}
              singlePlayerComponent={singlePlayerComponent}
              gameTitle={gameTitle}
              gameDescription={gameDescription}
            />
          </MultiplayerProvider>
        </TabsContent>
        
        {leaderboardComponent && (
          <TabsContent value="leaderboard">
            {leaderboardComponent}
          </TabsContent>
        )}
        
        {rulesComponent && (
          <TabsContent value="rules">
            {rulesComponent}
          </TabsContent>
        )}
      </Tabs>
    </PageLayout>
  );
};

export default GamePageTemplate;
