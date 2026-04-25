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
      const data = await api.getNotes({ starred: true });
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
    try {
      await api.updateNote(noteId, { starred: false });
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error('Failed to unstar note');
    }
  };

  // Pick up newly starred notes from SSE
  const handleEvent = useCallback((event) => {
    if (event.type === 'job_done' && event.data?.note?.starred) {
      setNotes(prev => [event.data.note, ...prev]);
    }
  }, []);

  useSSE(handleEvent);

  return (
    <div style={{ padding: '48px 24px 32px', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1a1d1f', marginBottom: '32px' }}>
        Favorites
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Loader2 size={32} className="spinner" style={{ color: '#33b1ff' }} />
        </div>
      ) : notes.length > 0 ? (
        notes.map(note => (
          <NoteCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
        ))
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', opacity: 0.2 }}>
          <Star size={64} strokeWidth={1} />
          <p style={{ marginTop: '16px', fontWeight: 700 }}>No favorites yet</p>
          <p style={{ fontSize: '14px', marginTop: '4px', color: '#6f767e' }}>
            Tap the heart on any clip to save it here
          </p>
        </div>
      )}
    </div>
  );
}
