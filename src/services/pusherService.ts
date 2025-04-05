import PusherJS from 'pusher-js';
import { DuelMatch, Player } from '@/utils/multiplayerGameState';
import { Difficulty } from '@/utils/gameLogic';
import { GameType } from '@/contexts/MultiplayerContext';
import { nanoid } from 'nanoid';

// Use import.meta.env instead of process.env for Vite compatibility
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || 'your-pusher-key';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'us2';

export interface PusherMessage {
  type: string;
  payload: any;
}

type ListenerCallback = (message: PusherMessage) => void;

class PusherService {
  private pusher: PusherJS | null = null;
  private userId: string | null = null;
  private username: string | null = null;
  private channels: Map<string, PusherJS.Channel> = new Map();
  private listeners: Map<string, ListenerCallback[]> = new Map();
  private isMockImplementation: boolean = import.meta.env.VITE_NEXT_PUBLIC_USE_MOCK_WEBSOCKET === 'true';
  private gameChannel: PusherJS.Channel | null = null;
  private privateChannel: PusherJS.Channel | null = null;

  constructor() {
    if (this.isMockImplementation) {
      console.warn('Using mock Pusher implementation for offline development.');
    }
  }

  public connect(userId: string, username: string): Promise<void> {
    this.userId = userId;
    this.username = username;

    return new Promise((resolve, reject) => {
      if (this.isMockImplementation) {
        console.log('Mock Pusher connected');
        // Simulate a real connection process with a delay
        setTimeout(() => {
          this.mockEmit('connect', { userId, username });
        }, 500);
        
        resolve();
        return;
      }

      try {
        this.pusher = new PusherJS(PUSHER_KEY, {
          cluster: PUSHER_CLUSTER,
          authEndpoint: '/api/pusher/auth'
        });

        // Subscribe to a general game channel
        this.gameChannel = this.pusher.subscribe('game-events');
        
        // Subscribe to a private user channel
        this.privateChannel = this.pusher.subscribe(`private-user-${userId}`);

        // Handle general connection events
        this.pusher.connection.bind('connected', () => {
          console.log('Pusher connected');
          this.mockEmit('connect', { userId, username });
          resolve();
        });

        this.pusher.connection.bind('disconnected', () => {
          console.log('Pusher disconnected');
          this.mockEmit('disconnect', {});
        });

        this.pusher.connection.bind('error', (error: any) => {
          console.error('Pusher connection error:', error);
          reject(error);
        });

        // Set up event listeners on the game channel
        if (this.gameChannel) {
          this.gameChannel.bind('match-created', (data: any) => {
            this.mockEmit('match_created', data);
          });

          this.gameChannel.bind('match-updated', (data: any) => {
            this.mockEmit('match_updated', data);
          });

          this.gameChannel.bind('available-matches', (data: any) => {
            this.mockEmit('available_matches', data);
          });

          this.gameChannel.bind('active-matches', (data: any) => {
            this.mockEmit('active_matches', data);
          });

          this.gameChannel.bind('leaderboard', (data: any) => {
            this.mockEmit('leaderboard', data);
          });
        }

        // Set up event listeners on the private channel
        if (this.privateChannel) {
          this.privateChannel.bind('match-joined', (data: any) => {
            this.mockEmit('match_joined', data);
          });
        }
      } catch (error) {
        console.error('Failed to initialize Pusher:', error);
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.pusher) {
      if (this.gameChannel) {
        this.pusher.unsubscribe('game-events');
        this.gameChannel = null;
      }
      
      if (this.privateChannel && this.userId) {
        this.pusher.unsubscribe(`private-user-${this.userId}`);
        this.privateChannel = null;
      }
      
      this.pusher.disconnect();
      this.pusher = null;
    }
  }

  public isConnected(): boolean {
    return this.isMockImplementation || (this.pusher?.connection.state === 'connected');
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
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    if (this.isMockImplementation) {
      console.log(`Mock sending: ${type}`, payload);
      this.mockEmit(type, payload);
      return;
    }

    // In a real implementation, you would make an API call to your backend
    // to trigger a Pusher event. For example:
    fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        channel: 'game-events', 
        event: type, 
        data: payload 
      })
    }).catch(error => {
      console.error('Failed to send Pusher event:', error);
    });
  }

  public createMatch(difficulty: string, gameType: GameType = 'math-duel'): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }
    
    // Mock implementation for development
    if (this.isMockImplementation) {
      console.log(`Mock sending: create_match`, { difficulty, gameType });
      
      // Create a new match with the current user
      const matchId = nanoid(8);
      const newMatch = {
        id: matchId,
        status: 'waiting',
        gameType,
        difficulty: difficulty as Difficulty,
        players: [
          {
            id: this.userId || 'user1',
            name: this.username || 'Player1',
            status: 'waiting',
            solution: '',
            progress: 0,
            score: 0
          }
        ],
        puzzle: '123456', // Mock puzzle
        spectators: [],
        timeLimit: this.getTimeLimitFromDifficulty(difficulty as Difficulty),
        createdAt: Date.now()
      };
      
      console.log(`Created new match: ${matchId}`);
      
      // Store the match in localStorage
      this.saveMatchToLocalStorage(newMatch);
      
      // Emit match_created event
      this.mockEmit('match_created', { match: newMatch });
      return;
    }
    
    // Real implementation would trigger a server event
    this.send('create_match', { difficulty, gameType });
  }

  public joinMatch(matchId: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    if (this.isMockImplementation) {
      console.log(`Mock sending: join_match`, { matchId });
      
      // Retrieve the match from localStorage
      const match = this.getMatchFromLocalStorage(matchId);
      
      if (match) {
        // Add the current user to the match
        if (!match.players.some(p => p.id === this.userId)) {
          match.players.push({
            id: this.userId || 'user2',
            name: this.username || 'Player2',
            status: 'waiting',
            solution: '',
            progress: 0,
            score: 0
          });
          
          // Update the match status to 'active' if we now have 2 players
          if (match.players.length === 2) {
            match.status = 'active';
            match.startTime = Date.now();
          }
          
          // Save the updated match
          this.saveMatchToLocalStorage(match);
        }
        
        // Mock emitting the match_joined event
        this.mockEmit('match_joined', { match });
        
        // Also emit match_updated for other clients
        this.mockEmit('match_updated', { match });
      } else {
        console.warn(`Match with ID ${matchId} not found in localStorage`);
      }
      return;
    }

    this.send('join_match', { matchId });
  }

  public leaveMatch(matchId: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('leave_match', { matchId });
  }

  public submitSolution(matchId: string, solution: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('submit_solution', { matchId, solution });
  }

  public updateSolution(matchId: string, solution: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('update_solution', { matchId, solution });
  }

  public spectateMatch(matchId: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('spectate_match', { matchId });
  }

  public sendReaction(matchId: string, reaction: string): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('send_reaction', { matchId, reaction });
  }

  public getAvailableMatches(gameType?: GameType): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('get_available_matches', { gameType });
  }

  public getActiveMatches(gameType?: GameType): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('get_active_matches', { gameType });
  }

  public getLeaderboard(gameType?: GameType): void {
    if (!this.isConnected() && !this.isMockImplementation) {
      console.error('Pusher not connected');
      return;
    }

    this.send('get_leaderboard', { gameType });
  }

  private mockEmit(event: string, payload: any): void {
    const message: PusherMessage = { type: event, payload };
    this.listeners.get(event)?.forEach(callback => callback(message));
  }
  
  private getTimeLimitFromDifficulty(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 90;
      case 'medium': return 60;
      case 'hard': return 45;
      case 'expert': return 30;
      default: return 60;
    }
  }
  
  // Helper method to save a match to localStorage
  private saveMatchToLocalStorage(match: any): void {
    try {
      // Get existing matches
      const existingMatchesJson = localStorage.getItem('hectoclash_active_matches');
      const existingMatches = existingMatchesJson ? JSON.parse(existingMatchesJson) : [];
      
      // Add or update this match
      const matchIndex = existingMatches.findIndex((m: any) => m.id === match.id);
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
  private getMatchFromLocalStorage(matchId: string): any {
    try {
      const existingMatchesJson = localStorage.getItem('hectoclash_active_matches');
      if (!existingMatchesJson) return undefined;
      
      const existingMatches = JSON.parse(existingMatchesJson);
      return existingMatches.find((match: any) => match.id === matchId);
    } catch (error) {
      console.error('Error retrieving match from localStorage:', error);
      return undefined;
    }
  }
}

const pusherService = new PusherService();
export default pusherService;
