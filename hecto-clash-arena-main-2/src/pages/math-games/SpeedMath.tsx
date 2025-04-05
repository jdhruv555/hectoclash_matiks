
import React from 'react';
import PageLayout from '@/components/PageLayout';
import SinglePlayerSpeedMath from '@/components/singleplayer/SinglePlayerSpeedMath';
import MultiplayerGameWrapper from '@/components/multiplayer/MultiplayerGameWrapper';

const SpeedMath: React.FC = () => {
  return (
    <PageLayout
      title="Speed Math"
      subtitle="Test your math calculation speed in single player or multiplayer modes"
    >
      <MultiplayerGameWrapper 
        gameType="math-duel"
        singlePlayerComponent={<SinglePlayerSpeedMath />}
        gameTitle="Speed Math Challenge"
        gameDescription="Create expressions that equal 100 using all numbers exactly once. Compete with friends in real-time!"
      />
    </PageLayout>
  );
};

export default SpeedMath;
