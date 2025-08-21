
import React from 'react';
import Icon from './Icon';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md shadow-sm" role="alert">
      <div className="flex items-center">
        <Icon name="error" className="w-6 h-6 mr-3 text-red-500" />
        <div>
          <p className="font-bold">An Error Occurred</p>
          <p>{message}</p>
        </div>
      </div>
       <div className="mt-4 text-right">
        <button
          onClick={onReset}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
