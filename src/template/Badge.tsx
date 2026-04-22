import React from 'react';

interface BadgeProps {
  text: string;
  type?: 'status' | 'severity' | 'priority' | 'default';
  className?: string;
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({ text, className = '', style }) => {
  const getColors = () => {
    const lowerText = text.toLowerCase();
    
    // Status/Severity common colors
    if (lowerText === 'open' || lowerText === 'high' || lowerText === 'critical') {
      return { bg: '#3b82f6', text: '#ffffff' }; // blue
    }
    if (lowerText === 'in progress' || lowerText === 'medium') {
      return { bg: '#f59e0b', text: '#ffffff' }; // amber
    }
    if (lowerText === 'resolved' || lowerText === 'low') {
      return { bg: '#10b981', text: '#ffffff' }; // emerald
    }
    if (lowerText === 'closed') {
      return { bg: '#64748b', text: '#ffffff' }; // slate
    }

    return { bg: '#64748b', text: '#ffffff' };
  };

  const { bg, text: textColor } = getColors();

  return (
    <button
      disabled
      style={{ 
        backgroundColor: bg, 
        color: textColor,
        ...style 
      }}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-default opacity-100 border-none outline-none shadow-sm min-w-[110px] ${className}`}
    >
      {text}
    </button>
  );
};

export default Badge;
