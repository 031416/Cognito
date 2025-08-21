import React from 'react';
import Icon from './Icon';

const Welcome: React.FC = () => {
  return (
    <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm animate-fade-in">
      <div className="flex justify-center mb-4">
        <Icon name="logo" className="w-16 h-16 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome to Cognito</h2>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
        Your AI-powered knowledge companion. Search for books from sources like Google Books and Archive.org to get instant summaries and insights.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name="search" className="w-6 h-6 text-blue-500"/>
            <h3 className="font-semibold text-md">1. Search</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find books by title or author.</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
             <Icon name="sparkles" className="w-6 h-6 text-blue-500"/>
            <h3 className="font-semibold text-md">2. Select</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose a book from the results.</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
             <Icon name="takeaways" className="w-6 h-6 text-blue-500"/>
            <h3 className="font-semibold text-md">3. Learn</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive an AI-generated summary.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;