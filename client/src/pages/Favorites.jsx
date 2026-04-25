import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import NoteCard from '../components/NoteCard';
import { useSSE } from '../hooks/useSSE';
import { Star, Loader2 } from 'lucide-react';

export default function Favorites() {
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { notes: data } = await api.getNotes({ starred: true });
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleToggleFavorite = async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Optimistic update
    setNotes(prev => prev.filter(n => n.id !== noteId));
    
    try {
      await api.updateNote(noteId, { starred: false });
    } catch (err) {
      console.error('Failed to unstar note');
      // Revert on failure
      setNotes(prev => [note, ...prev]);
    }
  };

  const handleEvent = useCallback((event) => {
    if (event.type === 'job_done' && event.data?.note?.starred) {
      setNotes(prev => [event.data.note, ...prev]);
    }
  }, []);

  useSSE(handleEvent);

  return (
    <div className="px-6 md:px-12 pt-12 pb-32 w-full max-w-5xl mx-auto">
      <h1 className="text-[32px] md:text-[42px] font-black tracking-tighter text-[#1a1d1f] mb-8">Favorites</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="spinner text-[#33b1ff]" />
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-20">
          <Star size={64} strokeWidth={1} />
          <p className="mt-4 font-bold">No favorites yet</p>
        </div>
      )}
    </div>
  );
}
