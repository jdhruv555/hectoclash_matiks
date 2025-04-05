export interface Problem {
  id: number;
  type: 'derivative' | 'integral';
  question: string;
  expression: string;
  answer: string;
  hint: string;
  points: number;
}

const DERIVATIVE_PROBLEMS: Problem[] = [
  {
    id: 1,
    type: 'derivative',
    question: "Find the derivative of:",
    expression: "f(x) = x² + 3x",
    answer: "2x + 3",
    hint: "Use the power rule and remember that the derivative of x is 1",
    points: 100
  },
  {
    id: 2,
    type: 'derivative',
    question: "Find the derivative of:",
    expression: "f(x) = x³ - 2x + 1",
    answer: "3x² - 2",
    hint: "Apply the power rule to x³ and remember that the derivative of constants is 0",
    points: 150
  },
  {
    id: 3,
    type: 'derivative',
    question: "Find the derivative of:",
    expression: "f(x) = sin(x)",
    answer: "cos(x)",
    hint: "Remember: The derivative of sin(x) is cos(x)",
    points: 200
  },
  {
    id: 4,
    type: 'derivative',
    question: "Find the derivative of:",
    expression: "f(x) = e^x",
    answer: "e^x",
    hint: "e^x is its own derivative!",
    points: 200
  }
];

const INTEGRAL_PROBLEMS: Problem[] = [
  {
    id: 5,
    type: 'integral',
    question: "Find the indefinite integral of:",
    expression: "∫ x dx",
    answer: "(x²)/2 + c",
    hint: "Remember to increase the power by 1 and divide by the new power",
    points: 150
  },
  {
    id: 6,
    type: 'integral',
    question: "Find the indefinite integral of:",
    expression: "∫ cos(x) dx",
    answer: "sin(x) + c",
    hint: "Remember: The integral of cos(x) is sin(x) + c",
    points: 200
  },
  {
    id: 7,
    type: 'integral',
    question: "Find the definite integral:",
    expression: "∫₀¹ x² dx",
    answer: "1/3",
    hint: "First find the antiderivative (x³/3), then evaluate at the bounds",
    points: 250
  }
];

export const getAllProblems = (): Problem[] => {
  return [...DERIVATIVE_PROBLEMS, ...INTEGRAL_PROBLEMS].sort((a, b) => a.points - b.points);
};

export const getProblemsByType = (type: 'derivative' | 'integral'): Problem[] => {
  return type === 'derivative' ? DERIVATIVE_PROBLEMS : INTEGRAL_PROBLEMS;
};

export const getProblemsByDifficulty = (minPoints: number, maxPoints: number): Problem[] => {
  return getAllProblems().filter(p => p.points >= minPoints && p.points <= maxPoints);
};

export const getNextProblem = (currentProblemId: number): Problem | null => {
  const allProblems = getAllProblems();
  const currentIndex = allProblems.findIndex(p => p.id === currentProblemId);
  return currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;
};

export const validateAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  // Remove spaces and convert to lowercase for comparison
  const normalizedUser = userAnswer.replace(/\s+/g, '').toLowerCase();
  const normalizedCorrect = correctAnswer.replace(/\s+/g, '').toLowerCase();
  
  // Handle equivalent forms (e.g., "x^2/2 + C" and "0.5x^2 + C")
  // This could be expanded with more sophisticated math expression parsing
  return normalizedUser === normalizedCorrect;
}; 