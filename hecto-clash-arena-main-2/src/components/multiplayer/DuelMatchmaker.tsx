
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMultiplayer } from '@/contexts/MultiplayerContext';
import { AlertCircle, Users, Trophy, Clock, ArrowRight, Copy, RefreshCw, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Difficulty } from '@/utils/gameLogic';
import DifficultySelector from '@/components/DifficultySelector';

const DuelMatchmaker: React.FC = () => {
  const { 
    state, 
    connect, 
    createMatch, 
    joinMatch, 
    getAvailableMatches, 
    getActiveMatches, 
    spectateMatch, 
    setUsername 
  } = useMultiplayer();
  
  const [matchId, setMatchId] = useState('');
  const [localUsername, setLocalUsername] = useState(state.username);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [activeTab, setActiveTab] = useState('join');
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force refresh matches on component mount
  useEffect(() => {
    // Connect to WebSocket on component mount
    if (state.status === 'disconnected') {
      connect().then(() => {
        console.log('Connected to WebSocket service');
        refreshMatches();
      });
    } else if (state.status === 'connected') {
      refreshMatches();
    }
  }, [state.status, connect]);

  // Refresh matches more frequently for local network play
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (state.status === 'connected') {
        refreshMatches(false);
      }
    }, 3000);
    
    return () => clearInterval(refreshInterval);
  }, [state.status, getAvailableMatches, getActiveMatches]);

  const refreshMatches = (showIndicator = true) => {
    if (showIndicator) {
      setIsRefreshing(true);
    }
    
    console.log('Refreshing match lists...');
    getAvailableMatches();
    getActiveMatches();
    setLastRefresh(Date.now());
    
    if (showIndicator) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };
  
  const handleCreateMatch = () => {
    console.log('Creating new match with difficulty:', difficulty);
    createMatch(difficulty);
    
    // Show toast with instructions
    toast.success('Match created! Share the match ID with others on your network to play together.');
  };
  
  const handleJoinMatch = () => {
    if (!matchId.trim()) {
      toast.error('Please enter a match ID');
      return;
    }
    
    console.log('Joining match with ID:', matchId.trim());
    joinMatch(matchId.trim());
  };
  
  const handleJoinSpecificMatch = (id: string) => {
    console.log('Joining specific match with ID:', id);
    joinMatch(id);
  };
  
  const handleSpectateMatch = (matchId: string) => {
    console.log('Spectating match with ID:', matchId);
    spectateMatch(matchId);
  };
  
  const handleUsernameChange = () => {
    if (localUsername.trim() && localUsername !== state.username) {
      setUsername(localUsername);
      toast.success(`Username updated to ${localUsername}`);
    }
  };
  
  const copyMatchIdToClipboard = (matchId: string) => {
    navigator.clipboard.writeText(matchId);
    toast.success('Match ID copied to clipboard! Share with others on your network.');
  };

  const shareMatchId = (matchId: string) => {
    // Calculate the current URL base without the path
    const urlBase = window.location.href.split('/').slice(0, 3).join('/');
    const gameType = state.currentGameType;
    const shareUrl = `${urlBase}/math-games/${gameType}?join=${matchId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my HectoClash match!',
        text: 'I\'ve created a multiplayer math game. Join me!',
        url: shareUrl
      }).catch(err => {
        console.error('Share failed:', err);
        copyMatchIdToClipboard(matchId);
      });
    } else {
      // Fallback to copying the URL
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  // Check for match ID in URL when component mounts
  useEffect(() => {
    const checkUrlForMatchId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const joinMatchId = urlParams.get('join');
      
      if (joinMatchId && state.status === 'connected') {
        console.log('Found match ID in URL:', joinMatchId);
        setMatchId(joinMatchId);
        
        // Auto-join after a small delay
        setTimeout(() => {
          joinMatch(joinMatchId);
          
          // Clean up URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }, 1000);
      }
    };
    
    if (state.status === 'connected') {
      checkUrlForMatchId();
    }
  }, [state.status, joinMatch]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6 border-primary/20 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 text-primary" />
            Multiplayer Duels
          </CardTitle>
          <CardDescription>
            Challenge other players on your network or join existing matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Username</label>
            <div className="flex gap-2">
              <Input 
                value={localUsername} 
                onChange={(e) => setLocalUsername(e.target.value)} 
                placeholder="Enter your username"
                maxLength={20}
                className="bg-black/20 border-white/10"
              />
              <Button 
                onClick={handleUsernameChange}
                variant="outline"
                disabled={!localUsername.trim() || localUsername === state.username}
              >
                Update
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="join" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="join">Join Match</TabsTrigger>
              <TabsTrigger value="create">Create Match</TabsTrigger>
              <TabsTrigger value="spectate">Spectate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="join" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter Match ID</label>
                <div className="flex gap-2">
                  <Input 
                    value={matchId} 
                    onChange={(e) => setMatchId(e.target.value)} 
                    placeholder="Enter match ID"
                    className="bg-black/20 border-white/10"
                  />
                  <Button 
                    onClick={handleJoinMatch}
                    disabled={!matchId.trim() || state.status !== 'connected'}
                  >
                    Join
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="font-medium mb-2">Available Matches</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => refreshMatches()}
                  disabled={state.status !== 'connected' || isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {state.availableMatches.length > 0 ? (
                <div className="space-y-2">
                  {state.availableMatches.map((match) => (
                    <div 
                      key={match.id} 
                      className="flex justify-between items-center p-3 bg-card/30 rounded-lg border border-white/5"
                    >
                      <div>
                        <p className="font-medium">{match.players[0].name}'s Match</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="mr-2">ID: {match.id}</span>
                          <span className="capitalize">{match.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyMatchIdToClipboard(match.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleJoinSpecificMatch(match.id)} 
                          size="sm"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-card/30 rounded-lg border border-white/5">
                  <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No available matches on your network</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                <DifficultySelector 
                  currentDifficulty={difficulty}
                  onSelectDifficulty={(diff) => setDifficulty(diff as Difficulty)}
                />
              </div>
              
              <Button 
                onClick={handleCreateMatch} 
                className="w-full"
                disabled={state.status !== 'connected'}
              >
                Create New Match
              </Button>
              
              {state.currentMatch && state.isHost && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="font-medium mb-2">Share this match with others:</p>
                  <div className="flex items-center justify-between bg-black/30 p-2 rounded mb-2">
                    <span className="font-mono">{state.currentMatch.id}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyMatchIdToClipboard(state.currentMatch!.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => shareMatchId(state.currentMatch!.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Have others on your network open this page and enter the match ID to join.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="spectate" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium mb-2">Active Matches on Your Network</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => refreshMatches()}
                  disabled={state.status !== 'connected' || isRefreshing}
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {state.activeMatches.length > 0 ? (
                <div className="space-y-2">
                  {state.activeMatches.map((match) => (
                    <div 
                      key={match.id} 
                      className="p-3 bg-card/30 rounded-lg border border-white/5 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {match.players[0]?.name} vs {match.players[1]?.name}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-2">ID: {match.id}</span>
                            <span className="capitalize mr-2">{match.difficulty}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{Math.floor((Date.now() - (match.startTime || 0)) / 1000)}s</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyMatchIdToClipboard(match.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleSpectateMatch(match.id)}
                          >
                            Spectate
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{match.players[0]?.progress || 0}%</span>
                            <span>{match.players[1]?.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-blue-500 h-full" 
                              style={{ width: `${match.players[0]?.progress || 0}%` }}
                            />
                            <div className="flex-grow" />
                            <div 
                              className="bg-red-500 h-full" 
                              style={{ width: `${match.players[1]?.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-card/30 rounded-lg border border-white/5">
                  <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active matches to spectate</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/5 pt-4">
          <div className="text-sm text-muted-foreground">
            <span>Status: </span>
            <span className={state.status === 'connected' ? 'text-green-500' : 'text-yellow-500'}>
              {state.status === 'connected' ? 'Connected (Local Network)' : state.status.charAt(0).toUpperCase() + state.status.slice(1)}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/leaderboards/global'}>
            Leaderboards <Trophy className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center">
        <Button variant="link" onClick={() => window.location.href = '/'}>
          Back to Home <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DuelMatchmaker;
