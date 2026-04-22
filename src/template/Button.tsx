import React from 'react';

interface ButtonProps {
  name: string;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  borderRadius?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  size = 'md',
  color = '#6366f1',
  borderRadius = '8px',
  className = '',
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: color,
        borderRadius: borderRadius,
        border: 'none',
      }}
      className={`
        ${sizeClasses[size]}
        text-white font-medium transition-all duration-200
        hover:opacity-70 active:scale-95
        focus:outline-none
        ${className}
      `}
    >
      {name}
    </button>
  );
};

export default Button;
