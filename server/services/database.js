import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function initDB() {
  const { error } = await supabase.from('lists').select('id').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
  console.log('✅ Supabase connected');
  
  // Ensure default lists exist
  const defaultLists = [
    { id: 'inbox', name: 'Inbox', emoji: '📥', sort_order: -1 },
    { id: 'watch-later', name: 'Watch Later', emoji: '📺', sort_order: 0 },
    { id: 'learn', name: 'Learn', emoji: '🧠', sort_order: 1 },
    { id: 'ideas', name: 'Ideas', emoji: '💡', sort_order: 2 },
    { id: 'opportunities', name: 'Opportunities', emoji: '🚀', sort_order: 3 },
    { id: 'recipes', name: 'Recipes', emoji: '🍳', sort_order: 4 },
    { id: 'poems-quotes', name: 'Quotes', emoji: '✍️', sort_order: 5 },
    { id: 'deals', name: 'Deals', emoji: '🏷️', sort_order: 6 },
    { id: 'events', name: 'Events', emoji: '📅', sort_order: 7 },
    { id: 'saved', name: 'Saved', emoji: '🔖', sort_order: 8 }
  ];

  for (const list of defaultLists) {
    const { data: existing } = await supabase.from('lists').select('id').eq('id', list.id).single();
    if (!existing) {
      console.log(`Initializing list: ${list.name}...`);
      await supabase.from('lists').insert({ ...list, is_default: list.id === 'inbox' });
    }
  }
  console.log('✅ Default lists verified');
}

// Notes
export async function createNote(params) {
  const { tags, ...noteData } = params;
  
  const { data: note, error } = await supabase
    .from('notes')
    .insert([noteData])
    .select()
    .single();

  if (error) throw error;

  if (tags && tags.length > 0) {
    await setNoteTags(note.id, tags);
  }

  return getNoteById(note.id);
}

export async function getNoteById(id) {
  const { data, error } = await supabase
    .from('notes')
    .select('*, note_tags(tags(name))')
    .eq('id', id)
    .single();

  if (error) throw error;

  // Flatten tags
  const tags = data.note_tags.map(nt => nt.tags.name);
  delete data.note_tags;
  return { ...data, tags };
}

export async function getAllNotes(filters = {}) {
  let query = supabase.from('notes').select('*, note_tags(tags(name))');

  if (filters.list_id) {
    query = query.eq('list_id', filters.list_id);
  }
  if (filters.starred !== undefined) {
    query = query.eq('starred', filters.starred);
  }
  if (filters.search) {
    query = query.textSearch('search_vector', filters.search, {
      type: 'websearch',
      config: 'english'
    });
  }
  
  // Tag filtering is tricky with joins in Supabase/PostgREST
  // For simplicity, we filter in JS if tag is provided, or use a complex query
  // Let's try to do it properly if possible, or just filter in JS for now
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  let notes = data.map(n => ({
    ...n,
    tags: n.note_tags.map(nt => nt.tags.name)
  }));
  
  notes.forEach(n => delete n.note_tags);

  if (filters.tag) {
    notes = notes.filter(n => n.tags.includes(filters.tag));
  }

  if (filters.limit) {
    const offset = filters.offset || 0;
    notes = notes.slice(offset, offset + filters.limit);
  }

  return notes;
}

export async function updateNote(id, updates) {
  const { tags, ...noteData } = updates;

  if (Object.keys(noteData).length > 0) {
    const { error } = await supabase
      .from('notes')
      .update({ ...noteData, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  if (tags !== undefined) {
    await setNoteTags(id, tags);
  }

  return getNoteById(id);
}

export async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// Tags
export async function getOrCreateTag(name) {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  const { data, error } = await supabase
    .from('tags')
    .upsert({ id, name }, { onConflict: 'name' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setNoteTags(noteId, tagNames) {
  // Delete existing tags
  await supabase.from('note_tags').delete().eq('note_id', noteId);

  if (!tagNames || tagNames.length === 0) return;

  // Create tags if they don't exist
  const tags = await Promise.all(tagNames.map(name => getOrCreateTag(name)));

  // Link tags to note
  const noteTags = tags.map(tag => ({
    note_id: noteId,
    tag_id: tag.id
  }));

  const { error } = await supabase.from('note_tags').insert(noteTags);
  if (error) throw error;
}

// Lists
export async function getAllLists() {
  // Supabase doesn't easily support counts in a simple select without grouping
  // We'll fetch lists and counts separately or use a view if we were in SQL
  // For now, let's just fetch lists and then maybe notes to count, or just lists
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  
  // Note: note_count will be handled by a separate query or in the frontend if needed
  // But let's try to get it here
  const { data: counts, error: countError } = await supabase.rpc('get_list_counts');
  // If RPC fails (not defined yet), we'll return lists without counts
  
  return lists.map(list => ({
    ...list,
    note_count: (counts && counts.find(c => c.list_id === list.id)?.count) || 0
  }));
}

export async function createList(data) {
  const { data: list, error } = await supabase
    .from('lists')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return list;
}

export async function updateList(id, data) {
  const { data: list, error } = await supabase
    .from('lists')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return list;
}

export async function deleteList(id) {
  if (id === 'inbox') {
    const error = new Error('Cannot delete default list');
    error.code = 'DEFAULT_LIST_PROTECTED';
    throw error;
  }
  
  // Move notes to inbox first
  const { error: moveError } = await supabase
    .from('notes')
    .update({ list_id: 'inbox' })
    .eq('id', id);
  
  if (moveError) throw moveError;

  const { error } = await supabase.from('lists').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// Settings
export async function getSetting(key) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data?.value || null;
}

export async function setSetting(key, value) {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value });
  if (error) throw error;
}

// Errors
export async function logError(jobId, message, stack, payload) {
  const { error } = await supabase
    .from('errors')
    .insert([{ job_id: jobId, error_message: message, stack, payload }]);
  if (error) console.error('Failed to log error to DB:', error.message);
}

export { supabase };
