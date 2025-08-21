import React from 'react';
import Icon from './Icon';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onImmediateSearch: () => void;
  disabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, onImmediateSearch, disabled }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onImmediateSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon name="search" className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for books by title or author..."
        className="w-full p-4 pl-12 text-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        disabled={disabled}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 px-6 m-1.5 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        disabled={disabled || !query.trim()}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
