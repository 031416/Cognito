export type BookSource = 'archive.org' | 'google-books' | 'project-gutenberg' | 'local';
export type InsightRequestType = 'summary' | 'takeaways' | 'questions';

export interface Book {
  id: string;
  source: BookSource;
  title: string;
  authors: string[];
  description?: string;
  coverImageUrl?: string;
  contentUrl?: string;
  // This mock content is for demo purposes to feed the summarizer
  mockContent?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SummaryResult {
  bookTitle: string;
  bookSource: BookSource;
  requestType: InsightRequestType;
  generatedContent: string;
  sources?: GroundingSource[];
}

export interface BookSearchResults {
  books: Book[];
  totalResults: number;
}
