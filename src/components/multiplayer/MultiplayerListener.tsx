import { useEffect } from 'react';
import { pusherClient, GameEvent } from '@/lib/pusher';

type MultiplayerListenerProps = {
  gameId: string;
  onGameEvent: (event: GameEvent) => void;
};

export const MultiplayerListener = ({ gameId, onGameEvent }: MultiplayerListenerProps) => {
  useEffect(() => {
    const channel = pusherClient.subscribe(`game-${gameId}`);

    // Bind to all game events
    channel.bind('start-game', (data: any) => {
      onGameEvent({ type: 'start-game', data });
    });

    channel.bind('player-move', (data: any) => {
      onGameEvent({ type: 'player-move', data });
    });

    channel.bind('game-end', (data: any) => {
      onGameEvent({ type: 'game-end', data });
    });

    channel.bind('player-join', (data: any) => {
      onGameEvent({ type: 'player-join', data });
    });

    channel.bind('player-leave', (data: any) => {
      onGameEvent({ type: 'player-leave', data });
    });

    return () => {
      pusherClient.unsubscribe(`game-${gameId}`);
    };
  }, [gameId, onGameEvent]);

  return null;
}; 