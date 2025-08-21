import React from 'react';
import { Book } from '../types';
import Icon from './Icon';

interface BookResultItemProps {
  book: Book;
  onSelect: (book: Book) => void;
}

const SourceTag: React.FC<{ source: Book['source'] }> = ({ source }) => {
    const sourceInfo: Record<string, { label: string; color: string }> = {
        'archive.org': { label: 'Archive.org', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' },
        'google-books': { label: 'Google Books', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' },
        'project-gutenberg': { label: 'Project Gutenberg', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300' },
        'local': { label: 'Local File', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' }
    };
    const { label, color } = sourceInfo[source] || { label: source, color: 'bg-slate-100 text-slate-800' };

    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
            {label}
        </span>
    );
};

const BookResultItem: React.FC<BookResultItemProps> = ({ book, onSelect }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row gap-4">
      <img 
        src={book.coverImageUrl} 
        alt={`Cover of ${book.title}`} 
        className="w-24 h-36 object-cover rounded-md flex-shrink-0 self-center sm:self-start bg-slate-200 dark:bg-slate-700"
      />
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-2">{book.title}</h3>
            <SourceTag source={book.source} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          by {book.authors.join(', ')}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
          {book.description}
        </p>
      </div>
      <div className="flex-shrink-0 self-center sm:self-end">
        <button
          onClick={() => onSelect(book)}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Icon name="sparkles" className="w-5 h-5" />
          Summarize
        </button>
      </div>
    </div>
  );
};

export default BookResultItem;