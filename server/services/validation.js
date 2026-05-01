import { z } from 'zod';

export const NoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  raw_text: z.string().optional(),
  source_type: z.enum(['url', 'screenshot', 'folder', 'manual']).optional(),
  source_url: z.string().url().optional(),
  source_platform: z.string().optional(),
  thumbnail: z.string().url().optional().nullable(),
  list_id: z.string().uuid().or(z.string().min(1)).optional(),
  starred: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const ListSchema = z.object({
  name: z.string().min(1).max(50),
  emoji: z.string().emoji().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  sort_order: z.number().int().optional(),
  is_default: z.boolean().optional(),
});

export const ProcessUrlSchema = z.object({
  url: z.string().url(),
});

export const ChatSchema = z.object({
  query: z.string().min(1).max(1000),
});

export const SearchSchema = z.object({
  query: z.string().min(1).max(255),
});

export const validate = (schema) => (req, res, next) => {
  try {
    if (req.method === 'GET') {
      req.query = schema.parse(req.query);
    } else {
      req.body = schema.parse(req.body);
    }
    next();
  } catch (err) {
    res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
};
