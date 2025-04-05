import express from 'express';
import cors from 'cors';
import Pusher from 'pusher';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Store active games
const activeGames = new Map<string, {
  players: string[];
  currentTurn: string;
  gameStarted: boolean;
  gameEnded: boolean;
}>();

// Create a new game
app.post('/api/games', (req, res) => {
  const gameId = Math.random().toString(36).substring(2, 8);
  activeGames.set(gameId, {
    players: [],
    currentTurn: '',
    gameStarted: false,
    gameEnded: false,
  });
  res.json({ gameId });
});

// Join a game
app.post('/api/games/:gameId/join', (req, res) => {
  const { gameId } = req.params;
  const { playerId } = req.body;

  const game = activeGames.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.players.length >= 2) {
    return res.status(400).json({ error: 'Game is full' });
  }

  game.players.push(playerId);
  pusher.trigger(`game-${gameId}`, 'player-join', { playerId });

  if (game.players.length === 2) {
    game.currentTurn = game.players[0];
    pusher.trigger(`game-${gameId}`, 'start-game', { players: game.players });
    game.gameStarted = true;
  }

  res.json({ game });
});

// Make a move
app.post('/api/games/:gameId/move', (req, res) => {
  const { gameId } = req.params;
  const { playerId, move } = req.body;

  const game = activeGames.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.currentTurn !== playerId) {
    return res.status(400).json({ error: 'Not your turn' });
  }

  // Broadcast the move to all players
  pusher.trigger(`game-${gameId}`, 'player-move', { playerId, move });

  // Switch turns
  const currentPlayerIndex = game.players.indexOf(playerId);
  game.currentTurn = game.players[(currentPlayerIndex + 1) % 2];

  res.json({ game });
});

// End game
app.post('/api/games/:gameId/end', (req, res) => {
  const { gameId } = req.params;
  const { winner } = req.body;

  const game = activeGames.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  game.gameEnded = true;
  pusher.trigger(`game-${gameId}`, 'game-end', { winner });
  activeGames.delete(gameId);

  res.json({ message: 'Game ended' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 