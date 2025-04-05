
import React, { useEffect, useState } from 'react';
import { useMultiplayer } from '@/contexts/MultiplayerContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/utils/gameLogic';
import { Clock, User, ArrowLeft, Trophy, MessageSquare, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SpectatorViewProps {
  onExit: () => void;
}

const SpectatorView: React.FC<SpectatorViewProps> = ({ onExit }) => {
  const { state, stopSpectating } = useMultiplayer();
  const [timeLeft, setTimeLeft] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string; reaction?: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const { currentMatch } = state;
  
  // Cannot render if there's no match
  if (!currentMatch) {
    return <div className="text-center p-4">No active match to spectate!</div>;
  }
  
  const player1 = currentMatch.players[0];
  const player2 = currentMatch.players[1];
  
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
      }
    };
    
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, [currentMatch]);
  
  // Add reactions and game events to chat
  useEffect(() => {
    // This would be handled by WebSocket messages in a real implementation
    // Simulate some reactions and events based on player progress
    const simulateEvents = () => {
      if (!currentMatch || currentMatch.status !== 'active') return;
      
      const player1Progress = player1?.progress || 0;
      const player2Progress = player2?.progress || 0;
      
      // Simulate milestone reactions
      if (player1Progress === 50 && !chatMessages.some(m => m.message.includes("halfway"))) {
        setChatMessages(prev => [...prev, { user: 'System', message: `${player1.name} is halfway through the puzzle!` }]);
      }
      
      if (player2Progress === 50 && !chatMessages.some(m => m.message.includes("halfway"))) {
        setChatMessages(prev => [...prev, { user: 'System', message: `${player2.name} is halfway through the puzzle!` }]);
      }
      
      // Simulate reactions from spectators occasionally
      if (Math.random() < 0.1 && chatMessages.length < 10) {
        const reactions = ['Wow!', 'Nice!', 'Great solve!', 'They\'re fast!', 'This is close!'];
        const spectatorNames = ['Spectator1', 'MathFan', 'PuzzleLover', 'NumbersGuru'];
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        const randomName = spectatorNames[Math.floor(Math.random() * spectatorNames.length)];
        
        setChatMessages(prev => [...prev, { user: randomName, message: randomReaction }]);
      }
    };
    
    const eventTimer = setInterval(simulateEvents, 5000);
    return () => clearInterval(eventTimer);
  }, [currentMatch, player1, player2, chatMessages]);
  
  // Game status and win condition checks
  const isMatchActive = currentMatch.status === 'active';
  const isMatchCompleted = currentMatch.status === 'completed';
  
  // Calculate how much time has elapsed
  const timeElapsed = currentMatch.startTime 
    ? Math.min(currentMatch.timeLimit, Math.floor((Date.now() - currentMatch.startTime) / 1000))
    : 0;
  
  // Calculate progress percentage for the timer
  const timeProgress = currentMatch.timeLimit 
    ? Math.max(0, 100 - (timeLeft / currentMatch.timeLimit * 100))
    : 0;
    
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { user: state.username, message: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-4 p-4 border border-primary/20 bg-black/40 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            <span className="text-blue-400">{player1?.name}</span> vs <span className="text-red-400">{player2?.name}</span>
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat {showChat ? 'Off' : 'On'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                stopSpectating();
                onExit();
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Exit
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">
          <span>Match ID: {currentMatch.id}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">Difficulty: {currentMatch.difficulty}</span>
          <span className="mx-2">•</span>
          <span>Spectators: {currentMatch.spectators.length}</span>
        </div>
        
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <span className="font-bold">
            {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
          </span>
        </div>
        
        <Progress value={timeProgress} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-400" />
                <span className="font-medium">{player1?.name}</span>
              </div>
              <span className="text-sm">{player1?.progress || 0}% complete</span>
            </div>
            <Progress value={player1?.progress || 0} className="h-3 bg-blue-950" />
            
            <div className="mt-3 font-mono text-sm">
              <div className="font-medium mb-1">Current Solution:</div>
              <div className="p-2 bg-black/30 rounded border border-white/5 min-h-10 break-all">
                {player1?.solution || "No solution yet..."}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-red-400" />
                <span className="font-medium">{player2?.name}</span>
              </div>
              <span className="text-sm">{player2?.progress || 0}% complete</span>
            </div>
            <Progress value={player2?.progress || 0} className="h-3 bg-red-950" />
            
            <div className="mt-3 font-mono text-sm">
              <div className="font-medium mb-1">Current Solution:</div>
              <div className="p-2 bg-black/30 rounded border border-white/5 min-h-10 break-all">
                {player2?.solution || "No solution yet..."}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-2 bg-black/40 rounded-lg border border-white/10">
          <div className="font-medium mb-1">Puzzle:</div>
          <div className="bg-black/60 p-2 rounded font-mono text-center text-xl tracking-widest">
            {currentMatch.puzzle.split('').join(' ')}
          </div>
        </div>
      </Card>
      
      {/* Chat panel */}
      {showChat && (
        <Card className="mb-4 p-3 border border-white/10 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Live Chat
            </h3>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={() => setShowChat(false)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-black/30 rounded border border-white/5 h-40 overflow-y-auto p-2 mb-2">
            {chatMessages.length > 0 ? (
              <div className="space-y-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">
                      {msg.user === 'System' ? (
                        <span className="text-primary">{msg.user}</span>
                      ) : (
                        msg.user
                      )}:
                    </span>{' '}
                    <span className={msg.user === 'System' ? 'text-muted-foreground' : ''}>
                      {msg.reaction || msg.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm h-full flex items-center justify-center">
                <span>Chat messages will appear here</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded bg-black/20 border border-white/10 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            />
            <Button size="sm" onClick={handleSendChat}>Send</Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            Note: In spectator mode, chat has a 5-second delay to prevent cheating
          </div>
        </Card>
      )}
      
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
                    <div className="text-sm">
                      Score: <span className="font-medium">{player.score}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Solve time: {solveTime}s
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
    </div>
  );
};

export default SpectatorView;
