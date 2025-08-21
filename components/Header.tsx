
import React from 'react';
import Icon from './Icon';

interface HeaderProps {
    onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onLogoClick}
            role="button"
            aria-label="Back to home"
          >
            <Icon name="logo" className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Cognito
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
