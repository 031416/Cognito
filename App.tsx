import React, { useState, useCallback } from 'react';
import { Book, SummaryResult, InsightRequestType } from './types';
import { generateContent, generateContentFromSearch } from './services/geminiService';
import Header from './components/Header';
import BookSearch from './components/BookSearch';
import SummaryView from './components/SummaryView';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';

type ViewState = 'search' | 'summarizing' | 'summary' | 'error';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('search');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaderText, setLoaderText] = useState<string>('Loading...');
  const [insightError, setInsightError] = useState<string | null>(null);
  const [currentBookContent, setCurrentBookContent] = useState<string | null>(null);


  const handleSelectBook = useCallback(async (book: Book) => {
    setSelectedBook(book);
    setViewState('summarizing');
    setError(null);
    setSummaryResult(null);
    setInsightError(null);
    
    const content = book.mockContent ?? null;
    setCurrentBookContent(content);

    try {
      let result;
      if (content) {
        setLoaderText('Generating summary...');
        const generatedText = await generateContent(content, 'summary');
        result = { generatedContent: generatedText, sources: [] };
      } else {
        setLoaderText('Summarizing with AI search...');
        result = await generateContentFromSearch(book.title, book.authors, 'summary');
      }

      setSummaryResult({
        bookTitle: book.title,
        bookSource: book.source,
        generatedContent: result.generatedContent,
        sources: result.sources,
        requestType: 'summary',
      });
      setViewState('summary');
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary. The AI service may be unavailable or the book could not be found online. Please try again later.');
      setViewState('error');
    }
  }, []);
  
  const handleGenerateInsights = useCallback(async (type: 'takeaways' | 'questions') => {
      if (!selectedBook) return;
      
      const previousResult = summaryResult;
      setLoaderText(`Generating ${type}...`);
      setViewState('summarizing');
      setInsightError(null);

      try {
        let result;
        if (currentBookContent) {
            const generatedText = await generateContent(currentBookContent, type);
            result = { generatedContent: generatedText, sources: summaryResult?.sources || [] };
        } else {
            result = await generateContentFromSearch(selectedBook.title, selectedBook.authors, type);
        }

        setSummaryResult({
          bookTitle: selectedBook.title,
          bookSource: selectedBook.source,
          generatedContent: result.generatedContent,
          sources: result.sources,
          requestType: type,
        });
        setViewState('summary');

      } catch(err) {
        console.error(err);
        setSummaryResult(previousResult);
        setViewState('summary');
        setInsightError(`Failed to generate ${type}. Please try again later.`);
      }
  }, [selectedBook, summaryResult, currentBookContent]);


  const resetToSearch = () => {
    setViewState('search');
    setSelectedBook(null);
    setSummaryResult(null);
    setError(null);
    setInsightError(null);
    setLoaderText('Loading...');
    setCurrentBookContent(null);
  };

  const renderContent = () => {
    switch (viewState) {
      case 'summarizing':
          return <Loader text={loaderText} />;
      case 'summary':
        if (!summaryResult) {
          return <ErrorDisplay message="An unexpected error occurred: summary data is missing." onReset={resetToSearch} />;
        }
        return (
          <SummaryView
            result={summaryResult}
            onReset={resetToSearch}
            onGenerateInsights={handleGenerateInsights}
            insightError={insightError}
          />
        );
      case 'error':
        return <ErrorDisplay message={error || 'An unknown error occurred.'} onReset={resetToSearch} />;
      case 'search':
      default:
        return <BookSearch onSelectBook={handleSelectBook} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header onLogoClick={resetToSearch} />
      <main className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="transition-all duration-300">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Cognito &copy; 2024. Summaries are AI-generated and may contain inaccuracies.</p>
      </footer>
    </div>
  );
};

export default App;
