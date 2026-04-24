import Tesseract from 'tesseract.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { summarizeContent } from './gemini.js';
import { createNote, getAllLists } from './database.js';
import { uploadImage } from './storage.js';

/**
 * Process an image file: OCR -> Gemini -> Supabase Note
 * @param {string} filePath 
 * @param {string} sourceType 
 * @param {Function} updateJobStep 
 */
export async function processImage(filePath, sourceType = 'screenshot', updateJobStep) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found: ${filePath}`);
  }

  try {
    updateJobStep('ocr');
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    
    if (!text || text.trim().length === 0) {
      throw new Error('OCR_FAILED');
    }

    updateJobStep('categorizing');
    const lists = await getAllLists();
    const aiResult = await summarizeContent(text, 'screenshot', lists.map(l => l.name));

    // Upload to storage
    const buffer = fs.readFileSync(filePath);
    const thumbnail = await uploadImage(buffer, 'image/jpeg');

    // Save to Supabase
    return createNote({
      id: uuidv4(),
      title: aiResult.title,
      content: aiResult.summary,
      raw_text: text,
      source_type: sourceType,
      thumbnail: thumbnail,
      list_id: aiResult.category,
      tags: aiResult.tags,
    });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
