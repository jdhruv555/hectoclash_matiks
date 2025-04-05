
import React, { useEffect, useState } from 'react';
import { useMultiplayer } from '@/contexts/MultiplayerContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import HectocBoard from '@/components/HectocBoard';
import { formatTime } from '@/utils/gameLogic';
import { ThumbsUp, ThumbsDown, Trophy, Clock, Brain, User, ArrowLeft, Smile, X } from 'lucide-react';
import { toast } from 'sonner';

const REACTIONS = ['👍', '👏', '🔥', '🧠', '😮', '🤔', '😂', '💪'];

interface DuelGameplayProps {
  onExit: () => void;
}

const DuelGameplay: React.FC<DuelGameplayProps> = ({ onExit }) => {
  const { state, leaveMatch, submitSolution, updateSolution, sendReaction } = useMultiplayer();
  const [currentSolution, setCurrentSolution] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  
  const { currentMatch } = state;
  
  // Cannot render if there's no match
  if (!currentMatch) {
    return <div className="text-center p-4">No active match!</div>;
  }
  
  // Find current player
  const currentPlayer = currentMatch.players.find(p => p.id === state.userId);
  // Find opponent player
  const opponentPlayer = currentMatch.players.find(p => p.id !== state.userId);
  
  // Check if the match is active
  const isMatchActive = currentMatch.status === 'active';
  // Check if the current player has finished
  const isPlayerFinished = currentPlayer?.status === 'finished';
  // Check if the match is completed
  const isMatchCompleted = currentMatch.status === 'completed';
  // Calculate remaining time
  const matchEndTime = (currentMatch.startTime || 0) + (currentMatch.timeLimit * 1000);
  
  useEffect(() => {
    // Update time left
    const updateTimer = () => {
      if (currentMatch.status === 'active' && currentMatch.startTime) {
        const endTime = currentMatch.startTime + (currentMatch.timeLimit * 1000);
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);
        
        // If time has run out and player hasn't finished, submit whatever they have
        if (remaining === 0 && currentPlayer && currentPlayer.status === 'playing') {
          submitSolution(currentSolution);
        }
      }
    };
    
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, [currentMatch, currentPlayer, currentSolution, submitSolution]);
  
  useEffect(() => {
    // Show toast when match starts
    if (currentMatch.status === 'active' && currentMatch.startTime) {
      toast.success('Match started! Solve the puzzle to win!');
    }
    
    // Show toast when match completes
    if (currentMatch.status === 'completed' && currentMatch.winner) {
      const isWinner = currentMatch.winner === state.userId;
      const winnerName = currentMatch.players.find(p => p.id === currentMatch.winner)?.name;
      
      if (isWinner) {
        toast.success('Congratulations! You won the match! 🎉');
      } else {
        toast.info(`${winnerName} won the match!`);
      }
    }
  }, [currentMatch.status, currentMatch.startTime, currentMatch.winner, currentMatch.players, state.userId]);
  
  const handleAddDigit = (digit: string) => {
    const newSolution = currentSolution + digit;
    setCurrentSolution(newSolution);
    updateSolution(newSolution);
  };
  
  const handleAddOperator = (operator: string) => {
    const newSolution = currentSolution + operator;
    setCurrentSolution(newSolution);
    updateSolution(newSolution);
  };
  
  const handleRemoveLast = () => {
    const newSolution = currentSolution.slice(0, -1);
    setCurrentSolution(newSolution);
    updateSolution(newSolution);
  };
  
  const handleClearSolution = () => {
    setCurrentSolution('');
    updateSolution('');
  };
  
  const handleCheckSolution = () => {
    submitSolution(currentSolution);
  };
  
  const handleSendReaction = (reaction: string) => {
    sendReaction(reaction);
    setShowReactions(false);
    toast.success('Reaction sent!');
  };
  
  // Calculate how much time has elapsed
  const timeElapsed = currentMatch.startTime 
    ? Math.min(currentMatch.timeLimit, Math.floor((Date.now() - currentMatch.startTime) / 1000))
    : 0;
  
  // Calculate progress percentage for the timer
  const timeProgress = currentMatch.timeLimit 
    ? Math.max(0, 100 - (timeLeft / currentMatch.timeLimit * 100))
    : 0;

  return (
    <div className="w-full">
      {/* Match info header */}
      <div className="mb-4 bg-card p-4 rounded-xl border border-white/10 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <span className="font-bold text-xl">
              {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowReactions(!showReactions)}
              disabled={isMatchCompleted}
            >
              <Smile className="h-4 w-4 mr-1" />
              React
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                leaveMatch();
                onExit();
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Leave
            </Button>
          </div>
        </div>
        
        <Progress value={timeProgress} className="h-2 mb-4" />
        
        <div className="flex justify-between">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <User className="h-4 w-4 mr-1 text-blue-400" />
              <span className="font-medium">{currentPlayer?.name || 'You'}</span>
            </div>
            <Progress value={currentPlayer?.progress || 0} className="h-2 w-20 bg-blue-950" />
          </div>
          
          <div className="text-center font-bold text-2xl">
            VS
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <User className="h-4 w-4 mr-1 text-red-400" />
              <span className="font-medium">{opponentPlayer?.name || 'Opponent'}</span>
            </div>
            <Progress value={opponentPlayer?.progress || 0} className="h-2 w-20 bg-red-950" />
          </div>
        </div>
      </div>
      
      {/* Reactions panel */}
      {showReactions && (
        <Card className="mb-4 p-3 flex flex-wrap justify-center gap-2 animate-fade-in">
          {REACTIONS.map(reaction => (
            <Button
              key={reaction}
              variant="outline"
              className="text-xl h-10 w-10 p-0"
              onClick={() => handleSendReaction(reaction)}
            >
              {reaction}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setShowReactions(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}
      
      {/* Game board */}
      <HectocBoard
        puzzle={currentMatch.puzzle}
        currentSolution={currentSolution}
        onAddDigit={handleAddDigit}
        onAddOperator={handleAddOperator}
        onRemoveLast={handleRemoveLast}
        onClearSolution={handleClearSolution}
        onCheckSolution={handleCheckSolution}
        gameActive={isMatchActive && !isPlayerFinished}
        gameCompleted={isPlayerFinished}
      />
      
      {/* Match results */}
      {isMatchCompleted && (
        <Card className="mt-4 p-4 bg-card/80 backdrop-blur-sm border border-white/10 animate-fade-in">
          <h3 className="text-center text-xl font-bold mb-4 flex items-center justify-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Match Results
          </h3>
          
          <div className="space-y-4">
            {currentMatch.players.map(player => {
              const isWinner = currentMatch.winner === player.id;
              const solveTime = player.finishTime && player.startTime 
                ? ((player.finishTime - player.startTime) / 1000).toFixed(1)
                : 'N/A';
                
              return (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg ${isWinner ? 'bg-green-950/30 border border-green-500/20' : 'bg-card/50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{player.name}</span>
                      {isWinner && (
                        <span className="ml-2 text-yellow-500 flex items-center">
                          <Trophy className="h-3 w-3 mr-1" /> Winner
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {player.status === 'finished' ? (
                        <div className="flex items-center text-green-400">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Incomplete
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>Solve time: {solveTime}s</span>
                    </div>
                    <div className="flex items-center">
                      <Brain className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>Score: {player.score}</span>
                    </div>
                  </div>
                  
                  {player.solution && (
                    <div className="mt-2 p-2 bg-black/30 rounded border border-white/5 font-mono text-sm">
                      {player.solution}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-4 gap-3">
            <Button variant="outline" onClick={onExit}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Lobby
            </Button>
            <Button onClick={() => window.location.href = '/leaderboards/global'}>
              <Trophy className="mr-1 h-4 w-4" /> Leaderboards
            </Button>
          </div>
        </Card>
      )}
      
      {/* Waiting for opponent */}
      {currentMatch.status === 'waiting' && (
        <Card className="mt-4 p-4 text-center animate-pulse">
          <h3 className="font-bold mb-2">Waiting for opponent...</h3>
          <p className="text-sm text-muted-foreground mb-4">Share this match ID with a friend:</p>
          <div className="p-2 bg-black/30 rounded border border-white/5 font-mono mb-4">
            {currentMatch.id}
          </div>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(currentMatch.id);
              toast.success('Match ID copied to clipboard');
            }}
            variant="outline"
            className="mb-2"
          >
            Copy Match ID
          </Button>
          {state.isHost && (
            <p className="text-sm text-muted-foreground mt-4">
              The match will start automatically when someone joins.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default DuelGameplay;
