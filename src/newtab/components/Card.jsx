import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, timeOfDay = 'evening', className = "", onClick, ...props }) {
  const isLight = timeOfDay === 'morning';
  
  // If the className already contains a background color (like WeatherCard), don't apply the default
  const defaultBg = className.includes('bg-') ? '' : (isLight ? "bg-[#FFFFFF]" : "bg-[#1C1C1E]");
  
  // The padding is normally p-6, but can be overridden by className (like p-4 for news cards)
  const defaultPadding = className.includes('p-') ? '' : 'p-6';

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`w-full rounded-[24px] ${defaultBg} ${defaultPadding} shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
