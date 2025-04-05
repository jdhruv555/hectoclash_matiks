
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PointsAnimationProps {
  points: number;
  isActive: boolean;
  onComplete?: () => void;
}

const PointsAnimation: React.FC<PointsAnimationProps> = ({ 
  points, 
  isActive, 
  onComplete 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animations, setAnimations] = useState<React.ReactNode[]>([]);
  
  // Handle the main points animation
  useEffect(() => {
    if (isActive) {
      // Random position within the middle of the screen
      const x = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
      const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;
      setPosition({ x, y });
      
      // Generate additional mini animations
      const miniAnimations = [];
      const colors = ['#FFD700', '#FF6347', '#00CED1', '#9370DB', '#32CD32'];
      
      for (let i = 0; i < 8; i++) {
        const offset = {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200
        };
        
        const delay = Math.random() * 0.3;
        const pointValue = Math.ceil(points / 8);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        miniAnimations.push(
          <motion.div
            key={i}
            className="mini-points"
            style={{ 
              position: 'fixed',
              left: position.x + offset.x,
              top: position.y + offset.y,
              zIndex: 9998,
              color,
              fontWeight: 'bold',
              fontSize: '16px',
              textShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
            initial={{ opacity: 0, scale: 0.2, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{ 
              duration: 1,
              delay
            }}
          >
            +{pointValue}
          </motion.div>
        );
      }
      
      setAnimations(miniAnimations);
      
      // Clean up
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, points, position.x, position.y]);
  
  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="points-earned neon-text"
            style={{ 
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 9999,
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)'
            }}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: 0 }}
            exit={{ opacity: 0, scale: 1, y: -50 }}
            transition={{ 
              duration: 1.5,
              type: "spring", 
              stiffness: 100 
            }}
          >
            +{points}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isActive && animations}
      </AnimatePresence>
    </>
  );
};

export default PointsAnimation;
