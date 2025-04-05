import Pusher from 'pusher-js';

export const pusherClient = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
});

export type GameEvent = {
  type: 'start-game' | 'player-move' | 'game-end' | 'player-join' | 'player-leave';
  data: any;
};

export type GameState = {
  players: string[];
  currentTurn: string;
  gameStarted: boolean;
  gameEnded: boolean;
  winner?: string;
}; 