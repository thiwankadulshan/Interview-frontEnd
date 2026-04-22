import React from 'react';

interface LoaderProps {
  text?: string;
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  text = 'Loading...',
  color = '#6366f1',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
        style={{ borderTopColor: color }}
        className="w-12 h-12 border-4 border-slate-700 border-solid rounded-full animate-spin"
      ></div>
      {text && (
        <p className="mt-4 text-slate-400 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
