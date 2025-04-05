
import { nanoid } from "nanoid";

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl?: string;
  rank?: string;
  rating?: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalMatches: number;
  averageSolveTime: number;
  highestScore: number;
  badges: string[];
  created: number;
  lastActive: number;
};

// User badges with descriptions
export const userBadges = {
  newcomer: "Newcomer - Just started the journey",
  quick_solver: "Quick Solver - Solved puzzles in record time",
  puzzle_master: "Puzzle Master - High accuracy in solving puzzles",
  math_genius: "Math Genius - Exceptional mathematical skills",
  win_streak: "Win Streak - Won multiple matches in a row",
  comeback_king: "Comeback King - Won after being behind",
  community_contributor: "Community Contributor - Active in the community",
  challenge_creator: "Challenge Creator - Created challenging puzzles",
  veteran: "Veteran - Longtime player with many matches"
};

// Ranks in order from lowest to highest
export const ranks = [
  "Bronze I",
  "Bronze II",
  "Bronze III",
  "Silver I",
  "Silver II",
  "Silver III",
  "Gold I",
  "Gold II",
  "Gold III",
  "Platinum I",
  "Platinum II",
  "Platinum III",
  "Diamond I",
  "Diamond II",
  "Diamond III",
  "Master",
  "Grandmaster"
];

// Calculate rank based on rating
export const calculateRank = (rating: number): string => {
  if (rating < 1000) return ranks[0];
  if (rating >= 2600) return ranks[ranks.length - 1];
  
  const index = Math.floor((rating - 1000) / 100);
  return ranks[Math.min(index, ranks.length - 1)];
};

// Mock implementation of user profile service
class UserService {
  private profile: UserProfile | null = null;

  constructor() {
    this.loadProfile();
  }

  private loadProfile() {
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedProfile) {
      try {
        this.profile = JSON.parse(storedProfile);
      } catch (e) {
        console.error('Failed to parse stored user profile:', e);
        this.createDefaultProfile();
      }
    } else {
      this.createDefaultProfile();
    }
  }

  private createDefaultProfile() {
    const userId = localStorage.getItem('userId') || nanoid();
    const username = localStorage.getItem('username') || `Player${Math.floor(Math.random() * 1000)}`;
    
    this.profile = {
      id: userId,
      username,
      rank: "Bronze I",
      rating: 1000,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      totalMatches: 0,
      averageSolveTime: 0,
      highestScore: 0,
      badges: ["newcomer"],
      created: Date.now(),
      lastActive: Date.now()
    };

    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    this.saveProfile();
  }

  private saveProfile() {
    if (this.profile) {
      localStorage.setItem('userProfile', JSON.stringify(this.profile));
    }
  }

  getProfile(): UserProfile {
    if (!this.profile) {
      this.loadProfile();
    }
    return this.profile!;
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    if (!this.profile) {
      this.loadProfile();
    }
    
    this.profile = {
      ...this.profile!,
      ...updates,
      lastActive: Date.now()
    };
    
    this.saveProfile();
    return this.profile;
  }

  updateUsername(username: string): UserProfile {
    localStorage.setItem('username', username);
    return this.updateProfile({ username });
  }

  updateStats(win: boolean, draw: boolean, score: number, solveTime: number): UserProfile {
    if (!this.profile) {
      this.loadProfile();
    }
    
    const wins = win ? this.profile!.wins + 1 : this.profile!.wins;
    const losses = !win && !draw ? this.profile!.losses + 1 : this.profile!.losses;
    const draws = draw ? this.profile!.draws + 1 : this.profile!.draws;
    const totalMatches = this.profile!.totalMatches + 1;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
    
    // Rating adjustment
    let ratingChange = 0;
    if (win) {
      ratingChange = 25;
    } else if (draw) {
      ratingChange = 0;
    } else {
      ratingChange = -15;
    }
    
    const newRating = Math.max(1000, (this.profile!.rating || 1000) + ratingChange);
    const rank = calculateRank(newRating);
    
    // Update highest score
    const highestScore = Math.max(this.profile!.highestScore, score);
    
    // Update average solve time
    const currentTotalTime = this.profile!.averageSolveTime * this.profile!.totalMatches;
    const newAverageSolveTime = (currentTotalTime + solveTime) / (this.profile!.totalMatches + 1);
    
    // Check for badges
    const badges = [...this.profile!.badges];
    
    if (totalMatches === 1 && !badges.includes('newcomer')) {
      badges.push('newcomer');
    }
    
    if (wins >= 10 && !badges.includes('veteran')) {
      badges.push('veteran');
    }
    
    if (solveTime < 20 && !badges.includes('quick_solver')) {
      badges.push('quick_solver');
    }
    
    if (highestScore > 500 && !badges.includes('math_genius')) {
      badges.push('math_genius');
    }
    
    return this.updateProfile({
      wins,
      losses,
      draws,
      totalMatches,
      winRate,
      rating: newRating,
      rank,
      highestScore,
      averageSolveTime: newAverageSolveTime,
      badges
    });
  }
}

export const userService = new UserService();
export default userService;
