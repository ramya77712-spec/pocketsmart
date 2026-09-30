import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color,
  text
}) => {
  const { theme } = useTheme();
  
  const defaultColor = color || (theme === 'dark' ? 'text-blue-400' : 'text-blue-600');
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} ${defaultColor} animate-spin`}>
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );
};

export const FullPageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className={`p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <svg
        className="w-6 h-6 text-blue-600 animate-spin mr-3"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};