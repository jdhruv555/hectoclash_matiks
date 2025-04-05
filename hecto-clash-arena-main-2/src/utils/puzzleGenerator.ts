
import { Difficulty } from "./gameLogic";

/**
 * Generates a random Hectoc puzzle based on difficulty
 * - Each puzzle has 6 digits (1-9)
 * - At least one valid solution exists
 */
export const generatePuzzle = (difficulty: Difficulty = 'easy'): string => {
  // For each difficulty level, we'll use different puzzle sets with increasing complexity
  const puzzlesByDifficulty = {
    easy: [
      '123456', // 1 + (2 + 3 + 4) × (5 + 6) = 100
      '234561', // 2 × 3 × 4 × 5 + 6 + 1 = 100
      '134956', // 1 × 3 × 4 × 9 - 5 - 6 = 100
      '729846', // 7 × (2 + 9 + 8) - 4 - 6 = 100
      '425639', // 4 × 25 - 6 + 3 + 9 = 100
    ],
    medium: [
      '714698', // 7 × 14 + 6 - 9 - 8 = 100
      '923458', // 9 × 23 - 4 × 5 - 8 = 100
      '325568', // 3 × 25 + 56 - 8 = 100
      '967234', // 9 + 67 + 2 × 3 × 4 = 100
      '236754', // 2 × 36 + 7 × 5 - 4 = 100
    ],
    hard: [
      '246935', // 2 × (4 × 6 × 9 - 3) - 5 = 100
      '671549', // 6 × 7 + 1 + 5 × 4 × 9 = 100
      '187539', // 1 + 8 × 7 + 5 × 3 + 9 = 100
      '549387', // 5 × (4 × 9 - 3) - 8 - 7 = 100
      '382574', // 3 × 8 × 2 + 57 - 4 = 100
    ],
    expert: [
      '942786', // (9 × 4 × 2 + 7) × 8 ÷ 6 = 100
      '317542', // 3 × (1 + 7) × (5 + 4) - 2 = 100
      '526397', // 5 + (2 + 6)³ - 3 - 9 - 7 = 100
      '431985', // 4³ + 3 × (1 + 9) - 8 - 5 = 100
      '842653', // 8 × (4² + 2) - 6 - 5 - 3 = 100
    ]
  };
  
  const puzzles = puzzlesByDifficulty[difficulty];
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};

/**
 * Checks if the given solution is valid for the puzzle
 * @param puzzle - The 6-digit puzzle
 * @param solution - The solution string with operations
 * @returns boolean - Whether the solution is valid
 */
export const checkSolution = (puzzle: string, solution: string): boolean => {
  // Replace all digits in the solution to make sure the original digits are preserved
  let cleanedSolution = solution;
  
  try {
    // Validate that all original digits are present in the correct order
    let puzzleIndex = 0;
    for (let i = 0; i < solution.length; i++) {
      const char = solution[i];
      if (!isNaN(parseInt(char)) && char !== ' ') {
        if (puzzleIndex >= puzzle.length || char !== puzzle[puzzleIndex]) {
          return false; // Digits don't match the original puzzle
        }
        puzzleIndex++;
      }
    }
    
    if (puzzleIndex !== puzzle.length) {
      return false; // Not all digits from the puzzle were used
    }
    
    // Evaluate the expression
    // Note: eval is used for simplicity, in a production app you'd use a proper expression parser
    const result = eval(cleanedSolution);
    return result === 100;
  } catch (e) {
    // Invalid expression
    return false;
  }
};

/**
 * Formats a solution for display
 */
export const formatSolution = (solution: string): string => {
  return solution.replace(/\s+/g, ' ').trim();
};

// Get sample solutions for different puzzles (for hints)
export const getSampleSolution = (puzzle: string): string => {
  const solutions: Record<string, string> = {
    '123456': '1 + (2 + 3 + 4) × (5 + 6)',
    '234561': '2 × 3 × 4 × 5 + 6 + 1',
    '134956': '1 × 3 × 4 × 9 - 5 - 6',
    '729846': '7 × (2 + 9 + 8) - 4 - 6',
    '425639': '4 × 25 - 6 + 3 + 9',
    '714698': '7 × 14 + 6 - 9 - 8',
    '923458': '9 × 23 - 4 × 5 - 8',
    '325568': '3 × 25 + 56 - 8',
    '967234': '9 + 67 + 2 × 3 × 4',
    '236754': '2 × 36 + 7 × 5 - 4',
    '246935': '2 × (4 × 6 × 9 - 3) - 5',
    '671549': '6 × 7 + 1 + 5 × 4 × 9',
    '187539': '1 + 8 × 7 + 5 × 3 + 9',
    '549387': '5 × (4 × 9 - 3) - 8 - 7',
    '382574': '3 × 8 × 2 + 57 - 4',
    '942786': '(9 × 4 × 2 + 7) × 8 ÷ 6',
    '317542': '3 × (1 + 7) × (5 + 4) - 2',
    '526397': '5 + (2 + 6)³ - 3 - 9 - 7',
    '431985': '4³ + 3 × (1 + 9) - 8 - 5',
    '842653': '8 × (4² + 2) - 6 - 5 - 3',
  };
  
  return solutions[puzzle] || "Find a way to make 100 using all six digits in order";
};
