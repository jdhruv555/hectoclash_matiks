import React, { useState, useEffect, useCallback } from 'react';
import { useMultiplayer } from '@/contexts/MultiplayerContext';
import { motion } from 'framer-motion';
import { Clock, Trophy, Users, Zap, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Difficulty } from '@/utils/gameLogic';
import DifficultySelector from '@/components/DifficultySelector';
import OperatorButton from '../OperatorButton';
import { checkSolution } from '@/utils/puzzleGenerator';
import { calculateProgress } from '@/utils/multiplayerGameState';
import Confetti from '@/components/Confetti';

type KeypadLayout = {
  digits: string[];
  operators: string[];
};

const SpeedMathMultiplayer: React.FC = () => {
  const { 
    state, 
    connect, 
    createMatch, 
    joinMatch, 
    leaveMatch, 
    startMatch,
    updateSolution,
    submitSolution
  } = useMultiplayer();
  
  const [matchId, setMatchId] = useState('');
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOperatorUsed, setLastOperatorUsed] = useState<string | undefined>(undefined);
  
  // Keypad layout
  const keypad: KeypadLayout = {
    digits: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    operators: ['+', '-', '×', '÷', '(', ')', '^', '⌫']
  };
  
  // Connect to the multiplayer service if not already connected
  useEffect(() => {
    if (state.status === 'disconnected') {
      connect().catch(error => {
        toast.error('Failed to connect to multiplayer service');
        console.error('Connection error:', error);
      });
    }
  }, [state.status, connect]);

  // Start the timer when the match becomes active
  useEffect(() => {
    if (state.currentMatch?.status === 'active' && state.currentMatch?.startTime) {
      setTimerActive(true);
      if (state.currentMatch.timeLimit) {
        setTimeRemaining(state.currentMatch.timeLimit);
      }
    } else {
      setTimerActive(false);
    }
  }, [state.currentMatch?.status, state.currentMatch?.startTime, state.currentMatch?.timeLimit]);
  
  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        // Calculate time based on server start time for accuracy
        if (state.currentMatch?.startTime) {
          const elapsed = Math.floor((Date.now() - state.currentMatch.startTime) / 1000);
          const remaining = Math.max(0, (state.currentMatch.timeLimit || 60) - elapsed);
          setTimeRemaining(remaining);
        } else {
          setTimeRemaining(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, state.currentMatch]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle game completion based on timer or solution
  useEffect(() => {
    // Time ran out
    if (timerActive && timeRemaining <= 0 && state.currentMatch?.status === 'active') {
      // Submit whatever solution they had
      if (solution && !isSubmitting) {
        handleSubmitSolution();
      }
    }
    
    // Handle match completion
    if (state.currentMatch?.status === 'completed' && state.currentMatch?.winner) {
      const isWinner = state.currentMatch.winner === state.userId;
      if (isWinner) {
        setShowConfetti(true);
        toast.success('You won the match!');
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast.error('You lost the match!');
      }
    }
  }, [timeRemaining, timerActive, state.currentMatch?.status, state.currentMatch?.winner, state.userId]);
  
  // Update solution in real-time
  useEffect(() => {
    if (state.currentMatch?.status === 'active' && state.userId) {
      // Send solution updates to keep other players informed
      updateSolution(solution);
    }
  }, [solution, state.currentMatch?.status, state.userId, updateSolution]);
  
  // Handle digit button click
  const handleDigitClick = useCallback((digit: string) => {
    if (!timerActive) return;
    
    setSolution(prev => prev + digit);
    setLastOperatorUsed(undefined);
  }, [timerActive]);
  
  // Handle operator button click
  const handleOperatorClick = useCallback((operator: string) => {
    if (!timerActive) return;
    
    if (operator === '⌫') {
      // Backspace functionality
      setSolution(prev => prev.slice(0, -1));
      setLastOperatorUsed(undefined);
    } else {
      setSolution(prev => prev + operator);
      setLastOperatorUsed(operator);
    }
  }, [timerActive]);
  
  // Check if a key is the most recently used operator by opponent
  const isRecentlyUsedByOpponent = (key: string): boolean => {
    if (!state.currentMatch || !state.userId) return false;
    
    const opponent = state.currentMatch.players.find(
      player => player.id !== state.userId
    );
    
    return opponent?.lastOperator === key;
  };
  
  // Create a new match
  const handleCreateMatch = () => {
    createMatch(difficulty);
    toast.success('Match created! Share the ID with your opponent.');
  };
  
  // Join an existing match
  const handleJoinMatch = () => {
    if (!matchId.trim()) {
      toast.error('Please enter a match ID');
      return;
    }
    
    joinMatch(matchId.trim());
  };
  
  // Start the match (host only)
  const handleStartMatch = () => {
    if (state.isHost && state.currentMatch) {
      startMatch();
      toast.success('Match started!');
    }
  };
  
  // Leave the current match
  const handleLeaveMatch = () => {
    if (state.currentMatch) {
      leaveMatch();
      setSolution('');
      setTimerActive(false);
    }
  };
  
  // Submit final solution
  const handleSubmitSolution = () => {
    if (!state.currentMatch || !solution) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isCorrect = checkSolution(state.currentMatch.puzzle, solution);
      
      submitSolution(solution);
      
      if (isCorrect) {
        toast.success('Correct solution submitted!');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast.error('Your solution is incorrect!');
      }
    } catch (error) {
      toast.error('Failed to submit solution');
      console.error('Submit error:', error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };
  
  // Calculate current progress percentage
  const getProgressPercentage = (playerId: string): number => {
    if (!state.currentMatch) return 0;
    
    const player = state.currentMatch.players.find(p => p.id === playerId);
    return player?.progress || 0;
  };
  
  // Render the lobby screen (not in a match)
  const renderLobby = () => (
    <Card className="bg-black/40 backdrop-blur-md border-primary/20 shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Speed Math Multiplayer</h2>
        
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            Challenge other players to solve math puzzles in real-time. Create a match or join an existing one.
          </p>
          
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Create a Match</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <DifficultySelector 
                  currentDifficulty={difficulty}
                  onSelectDifficulty={(diff) => setDifficulty(diff as Difficulty)}
                />
              </div>
              <Button onClick={handleCreateMatch} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Create New Match
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Join a Match</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter match ID"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-black/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
                />
                <Button onClick={handleJoinMatch}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground border-t border-white/10 pt-4">
            <p>
              Game Rules:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Both players receive the same sequence of numbers</li>
              <li>Use math operations to create an expression that equals 100</li>
              <li>First player to submit a correct solution wins</li>
              <li>Game ends when time runs out or both players submit a solution</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Render waiting room (match created, waiting for opponent)
  const renderWaitingRoom = () => {
    if (!state.currentMatch) return null;
    
    return (
      <Card className="bg-black/40 backdrop-blur-md border-primary/20 shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Waiting for Opponent</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Match ID</p>
              <p className="font-medium font-mono">{state.currentMatch.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
              <p className="font-medium capitalize">{state.currentMatch.difficulty}</p>
            </div>
          </div>
          
          <div className="bg-black/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Players ({state.currentMatch.players.length}/2)</h3>
            <ul className="space-y-2">
              {state.currentMatch.players.map(player => (
                <li key={player.id} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>{player.name} {player.id === state.userId ? '(You)' : ''}</span>
                </li>
              ))}
              {state.currentMatch.players.length < 2 && (
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  <span className="text-muted-foreground">Waiting for opponent...</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="flex gap-3">
            {state.isHost && state.currentMatch.players.length >= 2 ? (
              <Button onClick={handleStartMatch} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Start Match
              </Button>
            ) : (
              <div className="flex items-center text-sm text-amber-400 mb-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {state.isHost 
                  ? "Waiting for an opponent to join..."
                  : "Waiting for the host to start the match..."}
              </div>
            )}
            
            <Button variant="outline" onClick={handleLeaveMatch}>
              Leave Match
            </Button>
          </div>
          
          {state.isHost && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Share this match ID with your opponent so they can join!</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render active gameplay
  const renderGameplay = () => {
    if (!state.currentMatch) return null;
    
    const self = state.currentMatch.players.find(p => p.id === state.userId);
    const opponent = state.currentMatch.players.find(p => p.id !== state.userId);
    
    // Get target puzzle
    const puzzleDisplay = state.currentMatch.puzzle.split('').join(' ');
    
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Confetti active={showConfetti} />
        
        {/* Header with timer and player info */}
        <div className="flex justify-between items-center mb-4 bg-black/40 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-900/30 flex items-center justify-center rounded-full">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Players</p>
              <p className="font-medium">{self?.name} vs {opponent?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${timeRemaining < 10 ? 'bg-red-900/30 text-red-400 animate-pulse' : 'bg-amber-900/30 text-amber-400'}`}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time Remaining</p>
              <p className={`font-mono font-bold ${timeRemaining < 10 ? 'text-red-400' : ''}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress bars */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="font-medium">{self?.name} (You)</span>
              </div>
              <span className="font-mono">{getProgressPercentage(self?.id || '')}%</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(self?.id || '')}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mb-2 mt-4">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <span className="font-medium">{opponent?.name}</span>
              </div>
              <span className="font-mono">{getProgressPercentage(opponent?.id || '')}%</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(opponent?.id || '')}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Puzzle display */}
        <motion.div 
          className="bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-center text-lg mb-2 font-medium">Your Puzzle</h3>
          <div className="flex justify-center gap-2 my-2">
            {state.currentMatch.puzzle.split('').map((digit, index) => (
              <motion.div
                key={index}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {digit}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Create an expression that equals 100 using these digits in order
          </p>
        </motion.div>
        
        {/* Solution input */}
        <motion.div 
          className="bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="solution-preview mb-4 text-2xl font-mono">
            {solution || <span className="text-muted-foreground">Enter your solution...</span>}
          </div>
          
          <div className="grid grid-cols-5 gap-2 mb-3">
            {keypad.digits.map(digit => (
              <OperatorButton
                key={digit}
                operator={digit}
                onClick={() => handleDigitClick(digit)}
                disabled={!timerActive}
                multiplayer={true}
                isActive={isRecentlyUsedByOpponent(digit)}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {keypad.operators.map(op => (
              <OperatorButton
                key={op}
                operator={op}
                onClick={() => handleOperatorClick(op)}
                disabled={!timerActive}
                multiplayer={true}
                isActive={isRecentlyUsedByOpponent(op)}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleSubmitSolution} 
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
            disabled={!timerActive || !solution || isSubmitting}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Submit Solution
          </Button>
        </motion.div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLeaveMatch} size="sm">
            Leave Match
          </Button>
        </div>
      </div>
    );
  };
  
  // Render game result screen
  const renderGameResult = () => {
    if (!state.currentMatch) return null;
    
    const self = state.currentMatch.players.find(p => p.id === state.userId);
    const opponent = state.currentMatch.players.find(p => p.id !== state.userId);
    const isWinner = state.currentMatch.winner === state.userId;
    
    return (
      <Card className="bg-black/40 backdrop-blur-md border-primary/20 shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isWinner ? 'You Won!' : 'Game Over'}
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className={`p-6 rounded-full ${isWinner ? 'bg-green-900/30' : 'bg-amber-900/30'}`}>
              {isWinner ? (
                <Trophy className="h-16 w-16 text-yellow-400" />
              ) : (
                <Trophy className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-black/50 p-4 rounded-lg ${isWinner ? 'border-2 border-green-500/50' : ''}`}>
              <h3 className="font-medium text-center mb-2">{self?.name} (You)</h3>
              <p className="text-center text-2xl font-bold">{self?.score || 0}</p>
              <p className="text-center text-xs text-muted-foreground mt-1">points</p>
            </div>
            
            <div className={`bg-black/50 p-4 rounded-lg ${!isWinner && state.currentMatch.winner === opponent?.id ? 'border-2 border-green-500/50' : ''}`}>
              <h3 className="font-medium text-center mb-2">{opponent?.name}</h3>
              <p className="text-center text-2xl font-bold">{opponent?.score || 0}</p>
              <p className="text-center text-xs text-muted-foreground mt-1">points</p>
            </div>
          </div>
          
          {/* Solutions comparison */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Solutions</h3>
            
            <div className="bg-black/30 p-3 rounded-lg mb-2">
              <p className="text-sm text-muted-foreground">Your solution:</p>
              <p className="font-mono">{self?.solution || 'None'}</p>
            </div>
            
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Opponent's solution:</p>
              <p className="font-mono">{opponent?.solution || 'None'}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleLeaveMatch} className="flex-1">
              Return to Lobby
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render the appropriate view based on game state
  const renderContent = () => {
    if (!state.currentMatch) {
      return renderLobby();
    }
    
    if (state.currentMatch.status === 'waiting') {
      return renderWaitingRoom();
    }
    
    if (state.currentMatch.status === 'completed') {
      return renderGameResult();
    }
    
    return renderGameplay();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default SpeedMathMultiplayer;
