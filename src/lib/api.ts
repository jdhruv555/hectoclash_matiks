const API_BASE_URL = 'http://localhost:8081/api';

export interface Riddle {
  question: string;
  answer: string;
  hint: string;
  difficulty: string;
}

export interface GeometryDashProblem {
  type: 'math' | 'jump';
  position: number;
  value?: number;
}

export const api = {
  // Riddles
  getRiddles: async (): Promise<Riddle[]> => {
    const response = await fetch(`${API_BASE_URL}/riddles`);
    if (!response.ok) {
      throw new Error('Failed to fetch riddles');
    }
    return response.json();
  },

  // Geometry Dash
  getGeometryDashProblems: async (): Promise<GeometryDashProblem[]> => {
    const response = await fetch(`${API_BASE_URL}/geometry-dash/problems`);
    if (!response.ok) {
      throw new Error('Failed to fetch geometry dash problems');
    }
    return response.json();
  },

  saveGeometryDashScore: async (score: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/geometry-dash/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });
    if (!response.ok) {
      throw new Error('Failed to save score');
    }
  },
}; 