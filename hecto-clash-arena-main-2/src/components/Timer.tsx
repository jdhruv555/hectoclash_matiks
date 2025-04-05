
import React from "react";
import { formatTime } from "@/utils/gameLogic";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, AlertTriangle } from "lucide-react";

interface TimerProps {
  timeLeft: number;
  gameActive?: boolean;
  maxTime?: number;
  // Add support for totalTime (alternative name for maxTime) for backwards compatibility
  totalTime?: number;
  // Add support for className to allow styling
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ 
  timeLeft, 
  gameActive = true, 
  maxTime,
  totalTime,
  className = "" 
}) => {
  // Use maxTime if provided, otherwise use totalTime, or default to 120
  const effectiveMaxTime = maxTime || totalTime || 120;
  
  // Calculate the percentage of time left
  const percentage = (timeLeft / effectiveMaxTime) * 100;
  
  // Determine the color based on time left
  let timerColor = "bg-gradient-to-r from-green-400 to-green-500";
  let textColor = "text-green-400";
  let icon = <Clock className="mr-2 animate-pulse" />;
  
  if (timeLeft < effectiveMaxTime * 0.5) {
    timerColor = "bg-gradient-to-r from-yellow-400 to-yellow-500";
    textColor = "text-yellow-400";
    icon = <Clock className="mr-2 animate-pulse" />;
  }
  
  if (timeLeft < effectiveMaxTime * 0.25) {
    timerColor = "bg-gradient-to-r from-red-500 to-red-600";
    textColor = "text-red-500";
    icon = <AlertTriangle className="mr-2 animate-ping" />;
  }

  // Pulsing animation based on time left
  const pulseClass = timeLeft < effectiveMaxTime * 0.25 ? "animate-pulse" : "";

  return (
    <div className={`w-full bg-black/40 p-3 rounded-lg border border-white/10 ${pulseClass} ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {icon}
          <span className={`text-xl font-bold font-mono ${textColor}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        {gameActive && (
          <span className={`text-sm ${textColor}`}>
            {timeLeft >= effectiveMaxTime * 0.5 ? (
              <span className="flex items-center">
                <Zap className="mr-1 h-3 w-3" />
                Take your time
              </span>
            ) : timeLeft >= effectiveMaxTime * 0.25 ? (
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3 animate-pulse" />
                Hurry up!
              </span>
            ) : (
              <span className="flex items-center animate-pulse">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Almost out of time!
              </span>
            )}
          </span>
        )}
      </div>

      <div className="game-progress">
        <div 
          className={`${timerColor} h-full rounded transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
