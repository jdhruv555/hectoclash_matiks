
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { DuelMatch, Player, createDuelMatch, joinMatch, startMatch, submitSolution, handleDisconnect, addSpectator, removeSpectator } from '@/utils/multiplayerGameState';
import pusherService, { PusherMessage } from '@/services/pusherService';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

export type GameType = 'math-duel' | 'sudoku' | 'pattern-recognition' | 'memory-game' | 'number-puzzle' | 'cryptarithmetic';

export type MultiplayerStatus = 'disconnected' | 'connecting' | 'connected' | 'matchmaking' | 'in-match' | 'spectating';

export type MultiplayerState = {
  status: MultiplayerStatus;
  userId: string;
  username: string;
  currentMatch: DuelMatch | null;
  availableMatches: DuelMatch[];
  activeMatches: DuelMatch[];
  isHost: boolean;
  leaderboard: Player[];
  currentGameType: GameType;
};

export type MultiplayerAction =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT_SUCCESS' }
  | { type: 'CONNECT_ERROR', error: Error }
  | { type: 'DISCONNECT' }
  | { type: 'CREATE_MATCH_SUCCESS', match: DuelMatch }
  | { type: 'JOIN_MATCH_SUCCESS', match: DuelMatch }
  | { type: 'START_MATCH', match: DuelMatch }
  | { type: 'MATCH_UPDATED', match: DuelMatch }
  | { type: 'LEAVE_MATCH' }
  | { type: 'SET_AVAILABLE_MATCHES', matches: DuelMatch[] }
  | { type: 'SET_ACTIVE_MATCHES', matches: DuelMatch[] }
  | { type: 'SPECTATE_MATCH', match: DuelMatch }
  | { type: 'STOP_SPECTATING' }
  | { type: 'SET_LEADERBOARD', leaderboard: Player[] }
  | { type: 'SET_USERNAME', username: string }
  | { type: 'SET_GAME_TYPE', gameType: GameType };

const initialState: MultiplayerState = {
  status: 'disconnected',
  userId: localStorage.getItem('hectoclash_user_id') || nanoid(),
  username: localStorage.getItem('username') || `Player${Math.floor(Math.random() * 1000)}`,
  currentMatch: null,
  availableMatches: [],
  activeMatches: [],
  isHost: false,
  leaderboard: [],
  currentGameType: 'math-duel'
};

// Store the user ID in localStorage
if (!localStorage.getItem('hectoclash_user_id')) {
  localStorage.setItem('hectoclash_user_id', initialState.userId);
}

const reducer = (state: MultiplayerState, action: MultiplayerAction): MultiplayerState => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, status: 'connecting' };
    
    case 'CONNECT_SUCCESS':
      return { ...state, status: 'connected' };
    
    case 'CONNECT_ERROR':
      toast.error(`Connection error: ${action.error.message}`);
      return { ...state, status: 'disconnected' };
    
    case 'DISCONNECT':
      return { ...state, status: 'disconnected' };
    
    case 'CREATE_MATCH_SUCCESS':
      toast.success('Match created successfully');
      return { 
        ...state, 
        status: 'in-match', 
        currentMatch: action.match,
        isHost: true 
      };
    
    case 'JOIN_MATCH_SUCCESS':
      toast.success('Joined match successfully');
      return { 
        ...state, 
        status: 'in-match', 
        currentMatch: action.match,
        isHost: false 
      };
    
    case 'START_MATCH':
      return { ...state, currentMatch: action.match };
    
    case 'MATCH_UPDATED':
      if (state.currentMatch && state.currentMatch.id === action.match.id) {
        return { ...state, currentMatch: action.match };
      }
      return state;
    
    case 'LEAVE_MATCH':
      return { 
        ...state, 
        status: 'connected', 
        currentMatch: null,
        isHost: false 
      };
    
    case 'SET_AVAILABLE_MATCHES':
      return { ...state, availableMatches: action.matches };
    
    case 'SET_ACTIVE_MATCHES':
      return { ...state, activeMatches: action.matches };
    
    case 'SPECTATE_MATCH':
      return { 
        ...state, 
        status: 'spectating', 
        currentMatch: action.match 
      };
    
    case 'STOP_SPECTATING':
      return { 
        ...state, 
        status: 'connected', 
        currentMatch: null 
      };
    
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.leaderboard };
    
    case 'SET_USERNAME':
      localStorage.setItem('username', action.username);
      return { ...state, username: action.username };
    
    case 'SET_GAME_TYPE':
      return { ...state, currentGameType: action.gameType };
    
    default:
      return state;
  }
};

interface MultiplayerContextProps {
  state: MultiplayerState;
  connect: () => Promise<void>;
  disconnect: () => void;
  createMatch: (difficulty: string, gameType?: GameType) => void;
  joinMatch: (matchId: string) => void;
  leaveMatch: () => void;
  startMatch: () => void;
  submitSolution: (solution: string) => void;
  updateSolution: (solution: string) => void;
  spectateMatch: (matchId: string) => void;
  stopSpectating: () => void;
  sendReaction: (reaction: string) => void;
  getAvailableMatches: (gameType?: GameType) => void;
  getActiveMatches: (gameType?: GameType) => void;
  getLeaderboard: (gameType?: GameType) => void;
  setUsername: (username: string) => void;
  setGameType: (gameType: GameType) => void;
}

const MultiplayerContext = createContext<MultiplayerContextProps | undefined>(undefined);

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [connectionTimeout, setConnectionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('hectoclash_user_id', state.userId);
  }, [state.userId]);

  useEffect(() => {
    const handleConnect = (message: PusherMessage) => {
      console.log('Received connect event from Pusher');
      dispatch({ type: 'CONNECT_SUCCESS' });
      // Clear any pending connection timeout
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
    };

    const handleDisconnect = (message: PusherMessage) => {
      dispatch({ type: 'DISCONNECT' });
    };

    const handleMatchCreated = (message: PusherMessage) => {
      const match = message.payload.match as DuelMatch;
      dispatch({ type: 'CREATE_MATCH_SUCCESS', match });
    };

    const handleMatchJoined = (message: PusherMessage) => {
      const match = message.payload.match as DuelMatch;
      dispatch({ type: 'JOIN_MATCH_SUCCESS', match });
    };

    const handleMatchUpdated = (message: PusherMessage) => {
      const match = message.payload.match as DuelMatch;
      dispatch({ type: 'MATCH_UPDATED', match });
    };

    const handleAvailableMatches = (message: PusherMessage) => {
      const matches = message.payload.matches as DuelMatch[];
      dispatch({ type: 'SET_AVAILABLE_MATCHES', matches });
    };

    const handleActiveMatches = (message: PusherMessage) => {
      const matches = message.payload.matches as DuelMatch[];
      dispatch({ type: 'SET_ACTIVE_MATCHES', matches });
    };

    const handleLeaderboard = (message: PusherMessage) => {
      const leaderboard = message.payload.leaderboard as Player[];
      dispatch({ type: 'SET_LEADERBOARD', leaderboard });
    };

    pusherService.on('connect', handleConnect);
    pusherService.on('disconnect', handleDisconnect);
    pusherService.on('match_created', handleMatchCreated);
    pusherService.on('match_joined', handleMatchJoined);
    pusherService.on('match_updated', handleMatchUpdated);
    pusherService.on('available_matches', handleAvailableMatches);
    pusherService.on('active_matches', handleActiveMatches);
    pusherService.on('leaderboard', handleLeaderboard);

    return () => {
      pusherService.off('connect', handleConnect);
      pusherService.off('disconnect', handleDisconnect);
      pusherService.off('match_created', handleMatchCreated);
      pusherService.off('match_joined', handleMatchJoined);
      pusherService.off('match_updated', handleMatchUpdated);
      pusherService.off('available_matches', handleAvailableMatches);
      pusherService.off('active_matches', handleActiveMatches);
      pusherService.off('leaderboard', handleLeaderboard);
      
      // Clear any pending connection timeout
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [connectionTimeout]);

  const connect = async () => {
    dispatch({ type: 'CONNECT_INIT' });
    
    // Add a timeout to auto-transition to connected state after 3 seconds
    // This is especially important for the mock implementation
    const timeout = setTimeout(() => {
      if (state.status === 'connecting') {
        console.log('Connection timeout - forcing connected state');
        dispatch({ type: 'CONNECT_SUCCESS' });
      }
    }, 3000);
    
    setConnectionTimeout(timeout);
    
    try {
      await pusherService.connect(state.userId, state.username);
    } catch (error) {
      dispatch({ type: 'CONNECT_ERROR', error: error as Error });
      clearTimeout(timeout);
      setConnectionTimeout(null);
    }
  };

  const disconnect = () => {
    pusherService.disconnect();
    dispatch({ type: 'DISCONNECT' });
  };

  const createMatch = (difficulty: string, gameType?: GameType) => {
    const gameTypeToUse = gameType || state.currentGameType;
    pusherService.createMatch(difficulty, gameTypeToUse);
  };

  const joinMatch = (matchId: string) => {
    pusherService.joinMatch(matchId);
  };

  const leaveMatch = () => {
    if (state.currentMatch) {
      pusherService.leaveMatch(state.currentMatch.id);
      dispatch({ type: 'LEAVE_MATCH' });
    }
  };

  const startMatch = () => {
    if (state.currentMatch && state.isHost) {
      pusherService.send('start_match', { matchId: state.currentMatch.id });
    }
  };

  const submitSolution = (solution: string) => {
    if (state.currentMatch) {
      pusherService.submitSolution(state.currentMatch.id, solution);
    }
  };

  const updateSolution = (solution: string) => {
    if (state.currentMatch) {
      pusherService.updateSolution(state.currentMatch.id, solution);
    }
  };

  const spectateMatch = (matchId: string) => {
    pusherService.spectateMatch(matchId);
  };

  const stopSpectating = () => {
    if (state.currentMatch) {
      pusherService.send('stop_spectating', { matchId: state.currentMatch.id });
      dispatch({ type: 'STOP_SPECTATING' });
    }
  };

  const sendReaction = (reaction: string) => {
    if (state.currentMatch) {
      pusherService.sendReaction(state.currentMatch.id, reaction);
    }
  };

  const getAvailableMatches = (gameType?: GameType) => {
    const gameTypeToUse = gameType || state.currentGameType;
    pusherService.getAvailableMatches(gameTypeToUse);
  };

  const getActiveMatches = (gameType?: GameType) => {
    const gameTypeToUse = gameType || state.currentGameType;
    pusherService.getActiveMatches(gameTypeToUse);
  };

  const getLeaderboard = (gameType?: GameType) => {
    const gameTypeToUse = gameType || state.currentGameType;
    pusherService.getLeaderboard(gameTypeToUse);
  };

  const setUsername = (username: string) => {
    dispatch({ type: 'SET_USERNAME', username });
  };

  const setGameType = (gameType: GameType) => {
    dispatch({ type: 'SET_GAME_TYPE', gameType });
  };

  return (
    <MultiplayerContext.Provider
      value={{
        state,
        connect,
        disconnect,
        createMatch,
        joinMatch,
        leaveMatch,
        startMatch,
        submitSolution,
        updateSolution,
        spectateMatch,
        stopSpectating,
        sendReaction,
        getAvailableMatches,
        getActiveMatches,
        getLeaderboard,
        setUsername,
        setGameType
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

export default MultiplayerContext;
