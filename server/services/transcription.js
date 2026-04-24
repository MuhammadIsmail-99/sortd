import Groq from 'groq-sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Transcribe audio using Groq Whisper.
 * @param {string} filePath - absolute path to audio file (< 25MB)
 * @returns {Promise<string>} Plain text transcript
 */
export async function transcribeAudio(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-large-v3',
    response_format: 'text',
  });

  return transcription;
}
