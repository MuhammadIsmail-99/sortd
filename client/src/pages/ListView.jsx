import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import NoteCard from '../components/NoteCard';
import { ArrowLeft, Loader2, MoreVertical, Trash2 } from 'lucide-react';

export default function ListView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lists = await api.getLists();
        const currentList = lists.find(l => l.id === id);
        setList(currentList);
        
        const noteData = await api.getNotes({ list_id: id });
        setNotes(noteData);
      } catch (err) {
        console.error('Failed to fetch list data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this list? Notes will be moved to Inbox.')) {
      try {
        await api.deleteList(id);
        navigate('/lists');
      } catch (err) {
        alert('Failed to delete list');
      }
    }
  };

  if (loading) return (
    <div className="container loading-state">
      <Loader2 className="spinner" size={32} />
    </div>
  );

  if (!list) return (
    <div className="container">
      <h1 className="page-title">List not found</h1>
    </div>
  );

  return (
    <div className="container list-view-page">
      <div className="header-nav">
        <button className="back-btn" onClick={() => navigate('/lists')}>
          <ArrowLeft size={24} />
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          <Trash2 size={20} />
        </button>
      </div>

      <div className="list-header" style={{ '--list-color': list.color }}>
        <span className="list-emoji-hero">{list.emoji}</span>
        <h1 className="page-title">{list.name}</h1>
        <span className="pill-badge">{notes.length} notes</span>
      </div>

      {notes.length > 0 ? (
        <div className="notes-grid">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No notes in this list yet.</p>
        </div>
      )}

      <style>{`
        .header-nav {
          display: flex;
          justify-content: space-between;
          padding: var(--space-20) 0;
        }
        .back-btn, .delete-btn {
          color: var(--color-text-muted);
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--color-text); }
        .delete-btn:hover { color: var(--color-error); }
        
        .list-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-8);
          margin-bottom: var(--space-32);
          text-align: center;
        }
        .list-emoji-hero {
          font-size: 64px;
          margin-bottom: var(--space-8);
        }
        .list-header .page-title {
          margin: 0;
        }
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-24);
          padding-bottom: var(--space-48);
        }
        @media (max-width: 600px) {
          .notes-grid { grid-template-columns: 1fr; }
        }
        .loading-state, .empty-state {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }
        .spinner { animation: spin 1s linear infinite; color: var(--color-accent); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
