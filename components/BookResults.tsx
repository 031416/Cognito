
import React from 'react';
import { Book } from '../types';
import BookResultItem from './BookResultItem';

interface BookResultsProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const BookResults: React.FC<BookResultsProps> = ({ books, onSelectBook }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Results Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search term to find books.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <BookResultItem key={book.id} book={book} onSelect={onSelectBook} />
      ))}
    </div>
  );
};

export default BookResults;
