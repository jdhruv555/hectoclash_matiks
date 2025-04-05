
import { io, Socket } from 'socket.io-client';
import { DuelMatch } from '@/utils/multiplayerGameState';
import { Difficulty } from '@/utils/gameLogic';
import { GameType } from '@/contexts/MultiplayerContext';
import { createDuelMatch } from '@/utils/multiplayerGameState';

// Use import.meta.env instead of process.env for Vite compatibility
const WS_URL = import.meta.env.VITE_NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

type ListenerCallback = (message: WebSocketMessage) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private username: string | null = null;
  private listeners: Map<string, ListenerCallback[]> = new Map();
  // Use import.meta.env instead of process.env
  private isMockImplementation: boolean = import.meta.env.VITE_NEXT_PUBLIC_USE_MOCK_WEBSOCKET === 'true';

  constructor() {
    if (this.isMockImplementation) {
      console.warn('Using mock WebSocket implementation. No actual WebSocket connection will be established.');
    }
  }

  public connect(userId: string, username: string): Promise<void> {
    this.userId = userId;
    this.username = username;

    return new Promise((resolve, reject) => {
      if (this.isMockImplementation) {
        console.log('Mock WebSocket connected');
        // Important fix: we need to emit the connect event with a slight delay
        // to simulate a real connection process
        setTimeout(() => {
          this.mockEmit('connect', { userId, username });
        }, 500);
        
        resolve();
        return;
      }

      this.socket = io(WS_URL, {
        query: { userId, username },
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        resolve();
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.listeners.get('disconnect')?.forEach(callback => callback({ type: 'disconnect', payload: {} }));
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      this.socket.onAny((event, ...args) => {
        const message: WebSocketMessage = { type: event, payload: args[0] };
        this.listeners.get(event)?.forEach(callback => callback(message));
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.isMockImplementation || (this.socket?.connected ?? false);
  }

  public on(event: string, callback: ListenerCallback): void {
    const listeners = this.listeners.get(event) || [];
    listeners.push(callback);
    this.listeners.set(event, listeners);
  }

  public off(event: string, callback: ListenerCallback): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const newListeners = listeners.filter(cb => cb !== callback);
      this.listeners.set(event, newListeners);
    }
  }

  public send(type: string, payload: any): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    if (this.isMockImplementation) {
      console.log(`Mock sending: ${type}`, payload);
      this.mockEmit(type, payload);
      return;
    }

    this.socket?.emit(type, payload);
  }

  public createMatch(difficulty: string, gameType: GameType = 'math-duel'): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }
    
    // Mock implementation for development
    if (this.isMockImplementation) {
      console.log(`Mock sending: create_match`, { difficulty, gameType });
      
      // Create a new match with the current user
      const newMatch = createDuelMatch(
        this.userId || 'user1',
        this.username || 'Player1',
        difficulty as Difficulty,
        gameType
      );
      
      console.log(`Created new match: ${newMatch.id}`);
      
      // Store the match in localStorage
      this.saveMatchToLocalStorage(newMatch);
      
      // Emit match_created event
      this.mockEmit('match_created', { match: newMatch });
      return;
    }
    
    this.send('create_match', { difficulty, gameType });
  }

  public joinMatch(matchId: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    if (this.isMockImplementation) {
      console.log(`Mock sending: join_match`, { matchId });
      
      // Retrieve the match from localStorage
      const match = this.getMatchFromLocalStorage(matchId);
      
      if (match) {
        // Mock emitting the match_joined event
        this.mockEmit('match_joined', { match });
      } else {
        console.warn(`Match with ID ${matchId} not found in localStorage`);
      }
      return;
    }

    this.send('join_match', { matchId });
  }

  public leaveMatch(matchId: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('leave_match', { matchId });
  }

  public submitSolution(matchId: string, solution: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('submit_solution', { matchId, solution });
  }

  public updateSolution(matchId: string, solution: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('update_solution', { matchId, solution });
  }

  public spectateMatch(matchId: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('spectate_match', { matchId });
  }

  public sendReaction(matchId: string, reaction: string): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('send_reaction', { matchId, reaction });
  }

  public getAvailableMatches(gameType?: GameType): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('get_available_matches', { gameType });
  }

  public getActiveMatches(gameType?: GameType): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('get_active_matches', { gameType });
  }

  public getLeaderboard(gameType?: GameType): void {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send('get_leaderboard', { gameType });
  }

  private mockEmit(event: string, payload: any): void {
    const message: WebSocketMessage = { type: event, payload };
    this.listeners.get(event)?.forEach(callback => callback(message));
  }
  
  // Helper method to save a match to localStorage
  private saveMatchToLocalStorage(match: DuelMatch): void {
    try {
      // Get existing matches
      const existingMatchesJson = localStorage.getItem('hectoclash_active_matches');
      const existingMatches = existingMatchesJson ? JSON.parse(existingMatchesJson) : [];
      
      // Add or update this match
      const matchIndex = existingMatches.findIndex((m: DuelMatch) => m.id === match.id);
      if (matchIndex >= 0) {
        existingMatches[matchIndex] = match;
      } else {
        existingMatches.push(match);
      }
      
      // Save back to localStorage
      localStorage.setItem('hectoclash_active_matches', JSON.stringify(existingMatches));
    } catch (error) {
      console.error('Error saving match to localStorage:', error);
    }
  }

  // Helper method to retrieve a match from localStorage
  private getMatchFromLocalStorage(matchId: string): DuelMatch | undefined {
    try {
      const existingMatchesJson = localStorage.getItem('hectoclash_active_matches');
      if (!existingMatchesJson) return undefined;
      
      const existingMatches: DuelMatch[] = JSON.parse(existingMatchesJson);
      return existingMatches.find(match => match.id === matchId);
    } catch (error) {
      console.error('Error retrieving match from localStorage:', error);
      return undefined;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
