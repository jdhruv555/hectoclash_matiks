
import { generatePuzzle, checkSolution } from "./puzzleGenerator";
import { Difficulty } from "./gameLogic";
import { GameType } from "@/contexts/MultiplayerContext";
import { toast } from "sonner";

export type PlayerStatus = 'waiting' | 'ready' | 'playing' | 'finished' | 'disconnected';

export type Player = {
  id: string;
  name: string;
  score: number;
  status: PlayerStatus;
  solution: string;
  progress: number;
  startTime?: number;
  finishTime?: number;
  lastActiveTime?: number;
  lastOperator?: string;
};

export type DuelMatch = {
  id: string;
  puzzle: string;
  difficulty: Difficulty;
  gameType: GameType;
  status: 'waiting' | 'active' | 'completed';
  timeLimit: number;
  startTime?: number;
  endTime?: number;
  players: Player[];
  spectators: string[];
  winner?: string;
  lastUpdateTime: number;
};

// Generate a unique match ID
export const generateMatchId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new duel match
export const createDuelMatch = (
  playerId: string, 
  playerName: string, 
  difficulty: Difficulty = 'medium',
  gameType: GameType = 'math-duel'
): DuelMatch => {
  const matchId = generateMatchId();
  const puzzle = generatePuzzle(difficulty);
  
  // Set time limit based on difficulty
  const timeLimit = difficulty === 'easy' ? 90 : 
                   difficulty === 'medium' ? 60 : 
                   difficulty === 'hard' ? 45 : 30;
  
  return {
    id: matchId,
    puzzle,
    difficulty,
    gameType,
    status: 'waiting',
    timeLimit,
    lastUpdateTime: Date.now(),
    players: [
      {
        id: playerId,
        name: playerName,
        score: 0,
        status: 'ready' as PlayerStatus,
        solution: '',
        progress: 0,
        lastActiveTime: Date.now()
      }
    ],
    spectators: []
  };
};

// Join an existing match
export const joinMatch = (match: DuelMatch, playerId: string, playerName: string): DuelMatch => {
  if (match.players.length >= 2) {
    throw new Error("Match is already full");
  }
  
  return {
    ...match,
    lastUpdateTime: Date.now(),
    players: [
      ...match.players,
      {
        id: playerId,
        name: playerName,
        score: 0,
        status: 'ready' as PlayerStatus,
        solution: '',
        progress: 0,
        lastActiveTime: Date.now()
      }
    ]
  };
};

// Start a match
export const startMatch = (match: DuelMatch): DuelMatch => {
  if (match.players.length < 2) {
    throw new Error("Not enough players to start match");
  }
  
  if (match.status !== 'waiting') {
    throw new Error("Match has already started or ended");
  }
  
  const startTime = Date.now();
  
  return {
    ...match,
    status: 'active',
    startTime,
    lastUpdateTime: startTime,
    players: match.players.map(player => ({
      ...player,
      status: 'playing' as PlayerStatus,
      startTime,
      lastActiveTime: startTime
    }))
  };
};

// Calculate player progress based on solution
export const calculateProgress = (puzzle: string, solution: string): number => {
  // More sophisticated progress calculation
  if (!solution) return 0;
  
  // Count digits used from puzzle in solution
  let puzzleIndex = 0;
  
  for (let i = 0; i < solution.length; i++) {
    if (!isNaN(parseInt(solution[i])) && solution[i] !== ' ') {
      puzzleIndex++;
    }
  }
  
  // Base progress on digits used
  let progress = Math.floor((puzzleIndex / puzzle.length) * 70);
  
  // Additional progress for operators (suggests forming a complete expression)
  const operatorCount = (solution.match(/[\+\-\*\/\(\)\^]/g) || []).length;
  progress += Math.min(operatorCount * 5, 20);
  
  // Bonus for balanced parentheses
  const openParens = (solution.match(/\(/g) || []).length;
  const closeParens = (solution.match(/\)/g) || []).length;
  if (openParens > 0 && openParens === closeParens) {
    progress += 5;
  }
  
  // Check partial evaluation - solution that's getting closer to 100
  try {
    const safeEval = (expr: string): number | null => {
      try {
        // Replace × with * and ÷ with /
        const sanitizedExpr = expr
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        
        // Use Function constructor for safer evaluation
        return Function(`"use strict"; return (${sanitizedExpr})`)();
      } catch {
        return null;
      }
    };
    
    const result = safeEval(solution);
    if (result !== null) {
      // If result is getting closer to 100
      const distance = Math.abs(100 - result);
      if (distance < 50) {
        progress += 5;
      }
      if (distance < 20) {
        progress += 5;
      }
    }
  } catch (e) {
    // Ignore evaluation errors
  }
  
  return Math.min(progress, 100);
};

// Submit a solution
export const submitSolution = (match: DuelMatch, playerId: string, solution: string): DuelMatch => {
  if (match.status !== 'active') {
    throw new Error("Cannot submit solution for inactive match");
  }
  
  // Find player
  const playerIndex = match.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) {
    throw new Error("Player not found in match");
  }
  
  // Check if solution is correct
  const isCorrect = checkSolution(match.puzzle, solution);
  
  // Update player status and score
  const updatedPlayers = [...match.players];
  const player = updatedPlayers[playerIndex];
  
  updatedPlayers[playerIndex] = {
    ...player,
    solution,
    progress: calculateProgress(match.puzzle, solution),
    status: isCorrect ? 'finished' as PlayerStatus : 'playing' as PlayerStatus,
    finishTime: isCorrect ? Date.now() : undefined,
    lastActiveTime: Date.now(),
    score: isCorrect ? player.score + calculateScore(match.difficulty, player.startTime || 0) : player.score
  };
  
  // Check if match is complete
  const allFinished = updatedPlayers.every(p => p.status === 'finished' || p.status === 'disconnected');
  const matchEndTime = allFinished ? Date.now() : undefined;
  
  // Determine winner if match is complete
  let winnerId: string | undefined;
  if (allFinished) {
    const finishedPlayers = updatedPlayers.filter(p => p.status === 'finished');
    if (finishedPlayers.length > 0) {
      // Winner is the player with the highest score
      const maxScore = Math.max(...finishedPlayers.map(p => p.score));
      const winners = finishedPlayers.filter(p => p.score === maxScore);
      
      // If there's a tie, the winner is the one who finished first
      winnerId = winners.reduce((fastest, player) => {
        if (!fastest) return player.id;
        const fastestPlayer = updatedPlayers.find(p => p.id === fastest);
        return (player.finishTime || Infinity) < (fastestPlayer?.finishTime || Infinity) ? player.id : fastest;
      }, '');
    }
  }
  
  return {
    ...match,
    players: updatedPlayers,
    status: allFinished ? 'completed' : 'active',
    endTime: matchEndTime,
    winner: winnerId,
    lastUpdateTime: Date.now()
  };
};

// Update solution (during typing)
export const updateSolution = (match: DuelMatch, playerId: string, solution: string, lastOperator?: string): DuelMatch => {
  // Find player
  const playerIndex = match.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) {
    throw new Error("Player not found in match");
  }
  
  // Update player solution and progress
  const updatedPlayers = [...match.players];
  const player = updatedPlayers[playerIndex];
  
  updatedPlayers[playerIndex] = {
    ...player,
    solution,
    progress: calculateProgress(match.puzzle, solution),
    lastActiveTime: Date.now(),
    lastOperator
  };
  
  return {
    ...match,
    players: updatedPlayers,
    lastUpdateTime: Date.now()
  };
};

// Calculate score based on difficulty and time taken
const calculateScore = (difficulty: Difficulty, startTime: number): number => {
  const timeElapsed = (Date.now() - startTime) / 1000; // in seconds
  const basePoints = difficulty === 'easy' ? 100 :
                    difficulty === 'medium' ? 150 :
                    difficulty === 'hard' ? 200 : 300;
  
  // Time bonus: decreases as time increases
  const maxTimeBonus = basePoints;
  const timeLimit = difficulty === 'easy' ? 90 :
                   difficulty === 'medium' ? 60 :
                   difficulty === 'hard' ? 45 : 30;
  
  const timeBonus = Math.max(0, Math.floor(maxTimeBonus * (1 - timeElapsed / timeLimit)));
  
  return basePoints + timeBonus;
};

// Add a spectator to a match
export const addSpectator = (match: DuelMatch, spectatorId: string): DuelMatch => {
  if (match.spectators.includes(spectatorId)) {
    return match; // Spectator already added
  }
  
  return {
    ...match,
    spectators: [...match.spectators, spectatorId],
    lastUpdateTime: Date.now()
  };
};

// Remove a spectator from a match
export const removeSpectator = (match: DuelMatch, spectatorId: string): DuelMatch => {
  return {
    ...match,
    spectators: match.spectators.filter(id => id !== spectatorId),
    lastUpdateTime: Date.now()
  };
};

// Handle player disconnection
export const handleDisconnect = (match: DuelMatch, playerId: string): DuelMatch => {
  const playerIndex = match.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) {
    // Might be a spectator
    return removeSpectator(match, playerId);
  }
  
  const updatedPlayers = [...match.players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    status: 'disconnected' as PlayerStatus,
    lastActiveTime: Date.now()
  };
  
  // Check if match is complete
  const allFinished = updatedPlayers.every(p => p.status === 'finished' || p.status === 'disconnected');
  
  let winnerId: string | undefined;
  if (allFinished) {
    const activePlayers = updatedPlayers.filter(p => p.status === 'finished');
    if (activePlayers.length > 0) {
      // Winner is the player with the highest score
      const maxScore = Math.max(...activePlayers.map(p => p.score));
      winnerId = activePlayers.find(p => p.score === maxScore)?.id;
    }
  }
  
  return {
    ...match,
    players: updatedPlayers,
    status: allFinished ? 'completed' : match.status,
    winner: allFinished ? winnerId : undefined,
    lastUpdateTime: Date.now()
  };
};

// Check if a player is inactive (for auto-disconnection)
export const checkPlayerInactivity = (match: DuelMatch, inactivityThreshold: number = 30000): DuelMatch => {
  const now = Date.now();
  let updated = false;
  
  const updatedPlayers = match.players.map(player => {
    if (player.status === 'playing' && now - (player.lastActiveTime || 0) > inactivityThreshold) {
      updated = true;
      return {
        ...player,
        status: 'disconnected' as PlayerStatus,
        lastActiveTime: now
      };
    }
    return player;
  });
  
  if (!updated) {
    return match;
  }
  
  // Check if match is complete after disconnections
  const allFinished = updatedPlayers.every(p => p.status === 'finished' || p.status === 'disconnected');
  
  let winnerId: string | undefined;
  if (allFinished) {
    const activePlayers = updatedPlayers.filter(p => p.status === 'finished');
    if (activePlayers.length > 0) {
      // Winner is the player with the highest score
      const maxScore = Math.max(...activePlayers.map(p => p.score));
      winnerId = activePlayers.find(p => p.score === maxScore)?.id;
    }
  }
  
  return {
    ...match,
    players: updatedPlayers,
    status: allFinished ? 'completed' : match.status,
    winner: allFinished ? winnerId : undefined,
    lastUpdateTime: now
  };
};
