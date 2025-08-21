import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Book } from '../types';
import { searchBooks } from '../services/bookService';
import SearchBar from './SearchBar';
import BookResults from './BookResults';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import Welcome from './Welcome';
import Pagination from './Pagination';

interface BookSearchProps {
  onSelectBook: (book: Book) => void;
}

type SearchState = 'idle' | 'searching' | 'results' | 'error';

const RESULTS_PER_PAGE_APPROX = 40; // 20 from Google, 20 from Archive.org

const BookSearch: React.FC<BookSearchProps> = ({ onSelectBook }) => {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const debounceTimer = useRef<number | null>(null);

  const performSearch = useCallback(async (currentQuery: string, page: number) => {
    if (!currentQuery.trim()) {
      setSearchState('idle');
      setSearchResults([]);
      return;
    }
    setSearchState('searching');
    setError(null);
    setCurrentPage(page);
    try {
      const results = await searchBooks(currentQuery, page);
      setSearchResults(results.books);
      setTotalResults(results.totalResults);
      setSearchState('results');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch book results. Please try again.');
      setSearchState('error');
    }
  }, []);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(() => {
        performSearch(newQuery, 1);
    }, 500); // 500ms debounce
  };

  const handleImmediateSearch = () => {
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }
    performSearch(query, 1);
  };
  
  const handlePageChange = (newPage: number) => {
    performSearch(query, newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const resetSearch = useCallback(() => {
    setSearchState('idle');
    setQuery('');
    setSearchResults([]);
    setError(null);
    setCurrentPage(1);
    setTotalResults(0);
    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }
  }, []);
  
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE_APPROX);

  const renderSearchContent = () => {
    switch (searchState) {
      case 'searching':
        return <Loader text={'Searching...'} />;
      case 'results':
        return (
            <>
                <BookResults books={searchResults} onSelectBook={onSelectBook} />
                {totalPages > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
        );
      case 'error':
        return <ErrorDisplay message={error || 'Search failed.'} onReset={resetSearch} />;
      case 'idle':
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      <div className="mb-8">
        <SearchBar 
            query={query}
            onQueryChange={handleQueryChange}
            onImmediateSearch={handleImmediateSearch}
            disabled={searchState === 'searching'}
        />
      </div>
      <div className="transition-all duration-300">
        {renderSearchContent()}
      </div>
    </>
  );
};

export default BookSearch;
