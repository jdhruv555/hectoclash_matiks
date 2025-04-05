
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  pieces?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ 
  active, 
  duration = 3000, 
  pieces = 100 
}) => {
  const [confetti, setConfetti] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    if (!active) return;
    
    const colors = [
      '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
      '#ff00ff', '#00ffff', '#ff8800', '#ff0088',
      '#88ff00', '#00ff88', '#0088ff', '#8800ff'
    ];
    
    const shapes = [
      'circle', 'square', 'triangle', 'rectangle'
    ];
    
    const confettiPieces: React.ReactNode[] = [];
    
    for (let i = 0; i < pieces; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 10 + 5; // 5-15px
      const left = `${Math.random() * 100}%`;
      const opacity = Math.random() * 0.6 + 0.4;
      const speedMultiplier = Math.random() * 0.7 + 0.3;
      
      const style = {
        position: 'absolute',
        left,
        top: '-20px',
        width: `${size}px`,
        height: shape === 'rectangle' ? `${size * 1.5}px` : `${size}px`,
        backgroundColor: color,
        opacity,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : shape === 'rectangle' ? '2px' : '0',
        transform: shape === 'triangle' ? 'rotate(45deg)' : undefined,
        zIndex: 10000,
      } as React.CSSProperties;
      
      const animationProps = {
        initial: { 
          y: -20, 
          rotate: 0,
          scale: 0
        },
        animate: { 
          y: `calc(100vh + ${size}px)`,
          rotate: Math.random() * 360,
          x: Math.random() * 100 - 50,
          scale: 1
        },
        transition: { 
          duration: (Math.random() * 2 + 3) * speedMultiplier,
          ease: [0.1, 0.25, 0.95, 1],
          delay: Math.random() * 0.5 
        }
      };
      
      confettiPieces.push(
        <motion.div key={i} style={style} {...animationProps} />
      );
    }
    
    setConfetti(confettiPieces);
    
    const timer = setTimeout(() => {
      setConfetti([]);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [active, duration, pieces]);
  
  if (!active && confetti.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti}
    </div>
  );
};

export default Confetti;
