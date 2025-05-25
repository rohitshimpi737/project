import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  return (
    <FiRefreshCw 
      className={`animate-spin text-blue-500 ${sizeClasses[size]} ${className}`} 
      aria-label="Loading..."
    />
  );
};

export default LoadingSpinner;