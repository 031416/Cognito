
import { Book, BookSearchResults } from '../types';

// --- Configuration Constants ---
const CORS_PROXY = 'https://cors.eu.org/';
const RESULTS_PER_SOURCE = 20;

// To maintain summarization functionality for a few key examples from the APIs
const MOCK_CONTENTS: { [key: string]: string } = {
  'archive-artofwar': `The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected. The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: (1) The Moral Law; (2) Heaven; (3) Earth; (4) The Commander; (5) Method and discipline. All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.`,
  'archive-frankensteinor00shel': `I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business. He passed his younger days perpetually occupied by the affairs of his country; a variety of circumstances had prevented his marrying early, nor was it until the decline of life that he became a husband and the father of a family. As the circumstances of his marriage illustrate his character, I cannot refrain from relating them.`,
  'gutenberg-1342': `To go on with my story. I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterwards at York, from whence he had married my mother, whose relations were named Robinson, a very good family in that country, and from whom I was called Robinson Kreutznaer; but, by the usual corruption of words in England, we are now called—nay we call ourselves and write our name—Crusoe; and so my companions always called me.`
};

const getMockContent = (id: string): string | undefined => MOCK_CONTENTS[id];

const searchProjectGutenberg = async (query: string, page: number): Promise<{ books: Book[], total: number }> => {
    const url = `https://gutendex.com/books?search=${encodeURIComponent(query)}&page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gutendex API failed with status: ${response.status}`);
        const data = await response.json();
        const books: Book[] = data.results.map((item: any): Book => {
            const bookId = `gutenberg-${item.id}`;
            return {
                id: bookId,
                source: 'project-gutenberg',
                title: item.title,
                authors: item.authors.map((a: any) => a.name),
                description: `Formats: ${Object.keys(item.formats).join(', ')}`,
                coverImageUrl: item.formats['image/jpeg'],
                mockContent: getMockContent(bookId)
            };
        });
        return { books, total: data.count };
    } catch (error) {
        console.error("Failed to fetch from Gutendex (Project Gutenberg):", error);
        return { books: [], total: 0 };
    }
};

const searchArchiveOrg = async (query: string, page: number): Promise<{ books: Book[], total: number }> => {
    const url = `${CORS_PROXY}https://archive.org/advancedsearch.php?q=title:(${encodeURIComponent(query)}) AND mediatype:(texts)&fl[]=identifier,title,creator,description&rows=${RESULTS_PER_SOURCE}&page=${page}&output=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Archive.org API failed with status: ${response.status}`);
        const data = await response.json();
        const docs = data.response?.docs ?? [];
        const books: Book[] = docs.map((doc: any): Book => {
            const bookId = `archive-${doc.identifier}`;
            return {
                id: bookId,
                source: 'archive.org',
                title: doc.title || 'Untitled',
                authors: Array.isArray(doc.creator) ? doc.creator : [doc.creator || 'Unknown Author'],
                description: Array.isArray(doc.description) ? doc.description.join(' ') : doc.description,
                coverImageUrl: `https://archive.org/services/get-item-image.php?identifier=${doc.identifier}`,
                mockContent: getMockContent(bookId)
            };
        });
        return { books, total: data.response?.numFound ?? 0 };
    } catch (error) {
        console.error("Failed to fetch from Archive.org API:", error);
        return { books: [], total: 0 };
    }
};

const searchGoogleBooks = async (query: string, page: number): Promise<{ books: Book[], total: number }> => {
    const startIndex = (page - 1) * RESULTS_PER_SOURCE;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${RESULTS_PER_SOURCE}&startIndex=${startIndex}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Google Books API failed with status: ${response.status}`);
        const data = await response.json();
        const items = data.items || [];
        const books: Book[] = items.map((item: any): Book => ({
            id: `google-${item.id}`,
            source: 'google-books',
            title: item.volumeInfo?.title || 'Untitled',
            authors: item.volumeInfo?.authors || ['Unknown Author'],
            description: item.volumeInfo?.description,
            coverImageUrl: item.volumeInfo?.imageLinks?.thumbnail,
            contentUrl: item.volumeInfo?.previewLink,
        }));
        return { books, total: data.totalItems ?? 0 };
    } catch (error) {
        console.error("Failed to fetch from Google Books API:", error);
        return { books: [], total: 0 };
    }
};

export const searchBooks = async (query: string, page: number): Promise<BookSearchResults> => {
    if (!query.trim()) {
        return { books: [], totalResults: 0 };
    }

    const [googleResult, archiveResult, gutenbergResult] = await Promise.allSettled([
        searchGoogleBooks(query, page),
        searchArchiveOrg(query, page),
        searchProjectGutenberg(query, page),
    ]);

    const allBooks: Book[] = [];
    let totalResults = 0;

    const processResult = (result: PromiseSettledResult<{ books: Book[], total: number }>) => {
        if (result.status === 'fulfilled') {
            allBooks.push(...result.value.books);
            totalResults += result.value.total;
        } else {
            console.error("A search source failed:", result.reason);
        }
    };
    
    processResult(googleResult);
    processResult(archiveResult);
    processResult(gutenbergResult);

    const mergedBooks = new Map<string, Book>();

    allBooks.forEach(book => {
        const key = `${book.title.toLowerCase()}-${(book.authors || []).join(',').toLowerCase()}`;
        const existing = mergedBooks.get(key);

        if (!existing) {
            mergedBooks.set(key, book);
            return;
        }

        // If new book has content and old one doesn't, replace.
        if (book.mockContent && !existing.mockContent) {
            book.coverImageUrl = existing.coverImageUrl || book.coverImageUrl;
            book.description = existing.description || book.description;
            mergedBooks.set(key, book);
        } 
        // If old book has content, just enrich it with metadata from new book.
        else if (existing.mockContent) {
             existing.coverImageUrl = existing.coverImageUrl || book.coverImageUrl;
             existing.description = existing.description || book.description;
        }
    });

    const uniqueBooks = Array.from(mergedBooks.values());

    uniqueBooks.sort((a, b) => {
        const aHasContent = !!a.mockContent;
        const bHasContent = !!b.mockContent;
        if (aHasContent && !bHasContent) return -1;
        if (!aHasContent && bHasContent) return 1;
        return 0;
    });

    return { books: uniqueBooks, totalResults };
};
