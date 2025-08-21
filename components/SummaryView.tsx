import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SummaryResult, InsightRequestType, BookSource } from '../types';
import Icon from './Icon';

interface SummaryViewProps {
  result: SummaryResult;
  onReset: () => void;
  onGenerateInsights: (type: 'takeaways' | 'questions') => void;
  insightError: string | null;
}

const SummaryView: React.FC<SummaryViewProps> = ({ result, onReset, onGenerateInsights, insightError }) => {
  const getTitle = (requestType: InsightRequestType) => {
    switch (requestType) {
      case 'summary': return 'AI Summary';
      case 'takeaways': return 'Key Takeaways';
      case 'questions': return 'Discussion Questions';
    }
  };
  
  const sourceInfo: Record<BookSource, { label: string; color: string }> = {
    'archive.org': { label: 'Archive.org', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' },
    'google-books': { label: 'Google Books', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' },
    'project-gutenberg': { label: 'Project Gutenberg', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300' },
    'local': { label: 'Local File', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' },
  };
  const currentSourceInfo = sourceInfo[result.bookSource];

  const InsightButton: React.FC<{
    type: 'takeaways' | 'questions';
    icon: 'takeaways' | 'questions';
    label: string;
  }> = ({ type, icon, label }) => {
    return (
      <button
        onClick={() => onGenerateInsights(type)}
        className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-48"
      >
        <Icon name={icon} className="w-5 h-5"/>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          AI-Generated Insights for:
        </p>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{result.bookTitle}</h2>
         {currentSourceInfo && <span className={`text-xs font-medium mt-2 inline-block px-2.5 py-0.5 rounded-full ${currentSourceInfo.color}`}>
            {currentSourceInfo.label}
        </span>}
      </div>

      <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">{getTitle(result.requestType)}</h3>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {result.generatedContent}
        </ReactMarkdown>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-3">Sources</h4>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon name="link" className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  title={source.title}
                >
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}


      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
             <InsightButton type="takeaways" icon="takeaways" label="Key Takeaways" />
             <InsightButton type="questions" icon="questions" label="Discussion Questions" />
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <Icon name="search" className="w-5 h-5"/> New Search
          </button>
        </div>

        {insightError && (
          <div className="mt-4 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">{insightError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryView;