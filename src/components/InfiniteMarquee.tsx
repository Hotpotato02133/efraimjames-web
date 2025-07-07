import React from 'react';
import { motion } from 'framer-motion';

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  children,
  speed = 50,
  direction = 'left',
  className = ''
}) => {
  const animationDirection = direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="flex space-x-6"
        animate={{
          x: animationDirection,
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {/* Duplicate children for seamless loop */}
        <div className="flex space-x-6 shrink-0">
          {children}
        </div>
        <div className="flex space-x-6 shrink-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default InfiniteMarquee;
