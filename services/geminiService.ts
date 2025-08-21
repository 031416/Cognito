import { GoogleGenAI } from "@google/genai";
import { InsightRequestType, GroundingSource } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getPromptForText = (content: string, type: InsightRequestType): string => {
    switch(type) {
        case 'summary':
            return `You are an expert at summarizing complex texts. Provide a concise, well-structured summary of the following content. Use Markdown for formatting (e.g., headings, bold text, lists) to improve readability. Focus on the main ideas and core arguments. The summary should be easy to understand for a general audience.\n\n---\n\nCONTENT:\n${content}`;
        case 'takeaways':
            return `You are an AI assistant skilled in extracting key insights. From the following text, identify and list the 3 to 5 most important key takeaways. Present them as a Markdown bulleted list.\n\n---\n\nCONTENT:\n${content}`;
        case 'questions':
             return `You are a critical thinking assistant. Based on the provided text, generate 3 thought-provoking discussion questions that would encourage deeper reflection and conversation. Present them as a Markdown numbered list.\n\n---\n\nCONTENT:\n${content}`;
        default:
             return content;
    }
}

const getPromptForSearch = (title: string, authors: string[], type: InsightRequestType): string => {
    const authorStr = authors.join(', ');
    switch(type) {
        case 'summary':
            return `Provide a comprehensive summary for the book "${title}" by ${authorStr}. The summary should cover the main plot, themes, and ideas. Use Markdown for formatting (e.g., headings, bold text, lists).`;
        case 'takeaways':
            return `Identify and list the 3 to 5 most important key takeaways from the book "${title}" by ${authorStr}. Present them as a Markdown bulleted list.`;
        case 'questions':
             return `Generate 3 thought-provoking discussion questions about the book "${title}" by ${authorStr}. Present them as a Markdown numbered list.`;
        default:
             return `Find information about the book "${title}" by ${authorStr}.`;
    }
}


export const generateContent = async (
  bookContent: string,
  type: InsightRequestType,
): Promise<string> => {
  try {
    const prompt = getPromptForText(bookContent, type);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
           temperature: 0.5,
           topP: 0.95,
           topK: 64,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate content from AI service.");
  }
};


export const generateContentFromSearch = async (
  bookTitle: string,
  bookAuthors: string[],
  type: InsightRequestType,
): Promise<{ generatedContent: string; sources: GroundingSource[] }> => {
  try {
    const prompt = getPromptForSearch(bookTitle, bookAuthors, type);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        }
    });

    const generatedContent = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
      .map(web => ({ uri: web.uri, title: web.title }))
      // Basic deduplication
      .filter((source, index, self) => 
        index === self.findIndex((s) => s.uri === source.uri)
      );

    return { generatedContent, sources };

  } catch (error) {
    console.error("Error generating content with Gemini and Google Search:", error);
    throw new Error("Failed to generate content using search from AI service.");
  }
};