import React, { useState } from 'react';
import EyeIcon from '../assets/EyeIcon.svg';
import EyeOffIcon from '../assets/EyeOffIcon.svg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  showPasswordToggle = false, 
  type = 'text', 
  className = '', 
  id,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-black">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`w-full px-4 py-3 bg-slate-100 text-black border-none rounded-lg focus:ring-2 ${
            error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
          } outline-none transition-all ${showPasswordToggle ? 'pr-12' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <img
              src={showPassword ? EyeOffIcon : EyeIcon}
              alt=""
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
