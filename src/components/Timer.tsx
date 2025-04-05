import React, { useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  timeLeft: number;
  onTimeUp?: () => void;
  maxTime?: number;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  timeLeft, 
  onTimeUp,
  maxTime = 60,
  className = "" 
}) => {
  const percentage = (timeLeft / maxTime) * 100;
  
  let timerColor = "bg-gradient-to-r from-green-400 to-green-500";
  let textColor = "text-green-400";
  let icon = <Clock className="mr-2 animate-pulse" />;
  
  if (timeLeft < maxTime * 0.5) {
    timerColor = "bg-gradient-to-r from-yellow-400 to-yellow-500";
    textColor = "text-yellow-400";
  }
  
  if (timeLeft < maxTime * 0.25) {
    timerColor = "bg-gradient-to-r from-red-500 to-red-600";
    textColor = "text-red-500";
    icon = <AlertTriangle className="mr-2 animate-ping" />;
  }

  useEffect(() => {
    if (timeLeft === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pulseClass = timeLeft < maxTime * 0.25 ? "animate-pulse" : "";

  return (
    <div className={`flex items-center ${className} ${pulseClass}`}>
      {icon}
      <span className={`font-bold ${textColor}`}>
        {formatTime(timeLeft)}
      </span>
      <Progress 
        value={percentage} 
        className={`ml-4 w-24 h-2 ${timerColor}`} 
      />
    </div>
  );
};

export default Timer;
