import React, { useState, useEffect } from 'react';
import { useMultiplayer, GameType, MultiplayerProvider } from '@/contexts/MultiplayerContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DuelMatchmaker from '@/components/multiplayer/DuelMatchmaker';
import DuelGameplay from '@/components/multiplayer/DuelGameplay';
import SpectatorView from '@/components/multiplayer/SpectatorView';
import { toast } from 'sonner';
import { Trophy, Wifi, Users, Gamepad2, RefreshCw, AlertTriangle, Info } from 'lucide-react';

interface MultiplayerGameWrapperProps {
  gameType: GameType;
  singlePlayerComponent: React.ReactNode;
  gameTitle: string;
  gameDescription: string;
}

const MultiplayerGameInner: React.FC<MultiplayerGameWrapperProps> = ({
  gameType,
  singlePlayerComponent,
  gameTitle,
  gameDescription
}) => {
  const { state, setGameType, connect } = useMultiplayer();
  const [activeTab, setActiveTab] = useState<'singleplayer' | 'multiplayer'>('multiplayer');
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    if (state.currentGameType !== gameType) {
      setGameType(gameType);
    }
  }, [gameType, setGameType, state.currentGameType]);

  useEffect(() => {
    if (activeTab === 'multiplayer' && state.status === 'disconnected' && !connectionAttempted) {
      setConnectionAttempted(true);
      attemptConnection();
    }
  }, [activeTab, state.status, connectionAttempted]);

  const attemptConnection = () => {
    setIsReconnecting(true);
    connect().catch(error => {
      console.error('Failed to connect to multiplayer service:', error);
      toast.error('Failed to connect to multiplayer server');
      setOfflineMode(true);
    }).finally(() => {
      setIsReconnecting(false);
    });
  };

  useEffect(() => {
    const checkLocalStorageForMatches = () => {
      try {
        const matches = localStorage.getItem('hectoclash_active_matches');
        if (matches) {
          const activeMatches = JSON.parse(matches);
          if (activeMatches.length > 0) {
            const userIdInStorage = localStorage.getItem('hectoclash_user_id');
            if (userIdInStorage && userIdInStorage === state.userId) {
              const userMatch = activeMatches.find(m => 
                m.players.some(p => p.id === state.userId)
              );
              if (userMatch) {
                console.log('Found active match in localStorage:', userMatch);
                // We'll let the regular sync mechanism handle this
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking localStorage for matches:', error);
      }
    };

    if (activeTab === 'multiplayer') {
      checkLocalStorageForMatches();
    }
  }, [activeTab, state.userId]);

  useEffect(() => {
    console.log('Multiplayer state updated:', state.status, state.currentMatch);
  }, [state.status, state.currentMatch]);

  const renderMultiplayerContent = () => {
    console.log('Current multiplayer state:', state.status, state.currentMatch);
    
    if (state.status === 'connecting') {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="animate-spin h-6 w-6 text-primary" />
            <p className="text-lg">Connecting to multiplayer servers...</p>
          </div>
          {isReconnecting ? (
            <p className="text-sm text-muted-foreground">Attempting to reconnect...</p>
          ) : (
            <Button 
              variant="outline" 
              onClick={attemptConnection}
              disabled={isReconnecting}
            >
              Try Again
            </Button>
          )}
        </div>
      );
    }
    
    if (offlineMode || (state.status === 'disconnected' && connectionAttempted)) {
      return (
        <Card className="p-6 mb-6 backdrop-blur-sm border-2 border-red-500/30 bg-gradient-to-br from-black/80 to-gray-900/80">
          <div className="flex items-start gap-4">
            <div className="bg-red-900/20 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Multiplayer Not Available</h2>
              <p className="text-muted-foreground mb-4">
                The multiplayer server cannot be reached. This could be due to server maintenance or network issues.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-2 text-amber-400 mb-2">
                  <Info className="h-4 w-4" />
                  <strong>Note for Vercel Deployment:</strong>
                </span>
                Vercel's serverless functions do not support WebSocket connections directly. The app needs to be 
                configured with a third-party real-time service like Pusher. To enable multiplayer in production,
                set up a Pusher account and add your credentials as environment variables.
              </p>
              <Button 
                onClick={attemptConnection} 
                className="mr-2"
                disabled={isReconnecting}
              >
                {isReconnecting ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Reconnecting...
                  </>
                ) : (
                  <>Try Again</>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveTab('singleplayer')}
              >
                Switch to Single Player
              </Button>
            </div>
          </div>
        </Card>
      );
    }
    
    if (state.status === 'in-match' && state.currentMatch) {
      return <DuelGameplay onExit={() => window.location.reload()} />;
    }
    
    if (state.status === 'spectating' && state.currentMatch) {
      return <SpectatorView onExit={() => window.location.reload()} />;
    }
    
    return <DuelMatchmaker />;
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'singleplayer' | 'multiplayer')} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 pixel-border">
          <TabsTrigger value="singleplayer" className="font-gaming flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span>Single Player</span>
          </TabsTrigger>
          <TabsTrigger value="multiplayer" className="font-gaming flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Multiplayer</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="singleplayer" className="w-full animate-fade-in">
          {singlePlayerComponent}
        </TabsContent>
        
        <TabsContent value="multiplayer" className="w-full animate-fade-in">
          <Card className="p-6 mb-6 backdrop-blur-sm border-2 border-white/10 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-black/80 to-gray-900/80">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold tracking-tight mb-1 text-gradient-gold">{gameTitle} - Multiplayer Mode</h2>
                <p className="text-muted-foreground">{gameDescription}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {state.status === 'connected' && (
                    <Badge variant="game" className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <span>CONNECTED</span>
                    </Badge>
                  )}
                  {state.status === 'disconnected' && connectionAttempted && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>DISCONNECTED</span>
                    </Badge>
                  )}
                  <Badge variant="streak" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>CHALLENGE FRIENDS</span>
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="container mx-auto px-4 py-2">
            {renderMultiplayerContent()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MultiplayerGameWrapper: React.FC<MultiplayerGameWrapperProps> = (props) => {
  return (
    <MultiplayerProvider>
      <MultiplayerGameInner {...props} />
    </MultiplayerProvider>
  );
};

export default MultiplayerGameWrapper;
