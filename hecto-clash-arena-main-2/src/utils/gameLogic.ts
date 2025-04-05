
import { toast } from "sonner";
import { checkSolution } from "./puzzleGenerator";

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameState = {
  puzzle: string;
  currentSolution: string;
  timeLeft: number;
  score: number;
  gameActive: boolean;
  gameCompleted: boolean;
  level: number;
  difficulty: Difficulty;
  puzzlesSolved: number;
  streakCount: number;
  showPointsAnimation: boolean;
  lastPointsEarned: number;
};

export type GameAction = 
  | { type: 'START_GAME'; puzzle: string; difficulty?: Difficulty }
  | { type: 'ADD_DIGIT'; digit: string }
  | { type: 'ADD_OPERATOR'; operator: string }
  | { type: 'REMOVE_LAST'; }
  | { type: 'CLEAR_SOLUTION'; }
  | { type: 'CHECK_SOLUTION'; }
  | { type: 'TICK_TIMER'; }
  | { type: 'END_GAME'; }
  | { type: 'RESET_GAME'; }
  | { type: 'NEXT_LEVEL'; puzzle: string }
  | { type: 'CHANGE_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'HIDE_POINTS_ANIMATION'; };

export const initialGameState: GameState = {
  puzzle: '',
  currentSolution: '',
  timeLeft: 120, // 2 minutes
  score: 0,
  gameActive: false,
  gameCompleted: false,
  level: 1,
  difficulty: 'easy',
  puzzlesSolved: 0,
  streakCount: 0,
  showPointsAnimation: false,
  lastPointsEarned: 0,
};

// Get time based on difficulty
const getDifficultyTime = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 120; // 2 minutes
    case 'medium': return 90; // 1.5 minutes
    case 'hard': return 60; // 1 minute
    case 'expert': return 45; // 45 seconds
    default: return 120;
  }
};

// Get points based on difficulty
const getDifficultyPoints = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 100;
    case 'medium': return 150;
    case 'hard': return 250;
    case 'expert': return 400;
    default: return 100;
  }
};

// Get bonus points for streak
const getStreakBonus = (streakCount: number): number => {
  // Exponential bonus for longer streaks to make them more rewarding
  if (streakCount <= 1) return 0;
  if (streakCount <= 3) return streakCount * 10;
  if (streakCount <= 5) return streakCount * 15;
  if (streakCount <= 10) return streakCount * 25;
  return streakCount * 40; // Big bonus for streaks over 10
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const difficulty = action.difficulty || 'easy';
      return {
        ...initialGameState,
        puzzle: action.puzzle,
        gameActive: true,
        timeLeft: getDifficultyTime(difficulty),
        difficulty,
      };
    }
    
    case 'ADD_DIGIT':
      // Append the digit to the solution string
      return {
        ...state,
        currentSolution: state.currentSolution + action.digit,
      };
    
    case 'ADD_OPERATOR':
      // Append the operator to the solution string
      return {
        ...state,
        currentSolution: state.currentSolution + action.operator,
      };
    
    case 'REMOVE_LAST':
      // Remove the last character from the solution
      return {
        ...state,
        currentSolution: state.currentSolution.slice(0, -1),
      };
    
    case 'CLEAR_SOLUTION':
      // Clear the entire solution
      return {
        ...state,
        currentSolution: '',
      };
    
    case 'CHECK_SOLUTION':
      // Validate the current solution
      const isCorrect = checkSolution(state.puzzle, state.currentSolution);
      
      if (isCorrect) {
        const basePoints = getDifficultyPoints(state.difficulty);
        const timeBonus = Math.floor(state.timeLeft / 5);
        const levelBonus = state.level * 15;
        const streakBonus = getStreakBonus(state.streakCount);
        const totalPoints = basePoints + timeBonus + levelBonus + streakBonus;
        
        // Show detailed point breakdown - using string template instead of JSX
        toast.success(
          `Correct! +${totalPoints} points!`,
          {
            description: `Base: ${basePoints} • Time: +${timeBonus} • Level: +${levelBonus} • Streak: +${streakBonus}`
          }
        );
        
        // Show points animation and play sound effect
        // (We'll handle the sound effect in the UI component)
        
        // Complete the level but don't end the game yet
        return {
          ...state,
          score: state.score + totalPoints,
          gameCompleted: true,
          puzzlesSolved: state.puzzlesSolved + 1,
          streakCount: state.streakCount + 1,
          showPointsAnimation: true,
          lastPointsEarned: totalPoints,
        };
      } else {
        toast.error("Not quite right. Try again!");
        return {
          ...state, 
          streakCount: 0, // Reset streak on wrong answer
        };
      }
    
    case 'TICK_TIMER':
      // Decrement the timer by 1 second
      if (state.timeLeft <= 0) {
        toast.error("Time's up!");
        return {
          ...state,
          timeLeft: 0,
          gameActive: false,
        };
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    
    case 'END_GAME':
      // End the game early
      return {
        ...state,
        gameActive: false,
      };
    
    case 'RESET_GAME':
      // Reset to initial state
      return initialGameState;

    case 'HIDE_POINTS_ANIMATION':
      // Hide the points animation after it completes
      return {
        ...state,
        showPointsAnimation: false
      };
      
    case 'NEXT_LEVEL':
      // Move to the next level with a new puzzle
      const newLevel = state.level + 1;
      const isLevelMilestone = newLevel % 5 === 0;
      
      // For level milestones, we could trigger special effects or bonuses
      if (isLevelMilestone) {
        toast.success(
          `🏆 LEVEL ${newLevel} REACHED! 🏆`,
          {
            description: "Major milestone! Bonus time awarded!",
            className: "level-up"
          }
        );
      }
      
      return {
        ...state,
        puzzle: action.puzzle,
        currentSolution: '',
        level: newLevel,
        gameCompleted: false,
        gameActive: true,
        // Add a little time bonus for each level completed
        timeLeft: Math.min(
          getDifficultyTime(state.difficulty) + (isLevelMilestone ? 30 : 5), 
          getDifficultyTime(state.difficulty) + (state.level * 2)
        ),
      };
      
    case 'CHANGE_DIFFICULTY': 
      return {
        ...state,
        difficulty: action.difficulty
      };
      
    default:
      return state;
  }
};

// Helper functions to format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Calculate level progress percentage
export const calculateProgress = (currentLevel: number, targetLevel: number = 10): number => {
  return Math.min((currentLevel / targetLevel) * 100, 100);
};
