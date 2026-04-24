import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSetting } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

let genAI = null;
let model = null;

async function getClient() {
  if (genAI) return { genAI, model };

  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    apiKey = await getSetting('gemini_api_key');
  }

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment or database');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    }
  });

  return { genAI, model };
}

/**
 * Summarize and categorize content from a transcript or OCR.
 * @param {string} text - full text content
 * @param {string} platform - source platform name
 * @param {string[]} customListNames - optional user list names
 * @returns {Promise<{
 *   title: string,
 *   summary: string,
 *   category: string,
 *   tags: string[]
 * }>}
 */
export async function summarizeContent(text, platform, customListNames = []) {
  const { model } = await getClient();

  const prompt = `
You are a content categorization assistant for "Sortd".
Analyze the following content from a ${platform} and return JSON.

Available categories: watch-later, events, opportunities, poems-quotes,
recipes, ideas, deals, learn, saved, inbox
${customListNames.length > 0 ? `Custom user categories: ${customListNames.join(', ')}` : ''}

Rules:
1. "title" should be a concise, catchy title for the note.
2. "summary" should be a high-quality summary of the main points (markdown allowed).
3. "category" MUST be one of the available categories listed above. Choose the best fit.
4. "tags" should be an array of 3-5 relevant keywords.

Return ONLY valid JSON:
{ "title": "...", "summary": "...", "category": "...", "tags": [...] }

Content:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

/**
 * Categorize metadata-only content.
 * @param {string} text - metadata title + description
 * @param {string} platform
 * @param {string[]} customListNames
 */
export async function categorizeContent(text, platform, customListNames = []) {
  // Uses the same logic but with a slightly different context if needed
  // For now, summarizeContent is robust enough
  return summarizeContent(text, platform, customListNames);
}

/**
 * Update the in-memory Gemini client (used when API key is updated via settings)
 */
export function resetGeminiClient() {
  genAI = null;
  model = null;
}
