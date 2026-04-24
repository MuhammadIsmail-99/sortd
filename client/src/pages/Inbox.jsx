import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import NoteCard from '../components/NoteCard';
import { Search, Inbox as InboxIcon, Loader2 } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import ProcessingOverlay from '../components/ProcessingOverlay';

export default function Inbox() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeJobs, setActiveJobs] = useState([]);

  const fetchNotes = async () => {
    try {
      const data = await api.getNotes({ search });
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  // Handle SSE events via callback to avoid infinite re-render loops
  const handleEvent = useCallback((event) => {
    if (event.type === 'job_done') {
      // Add new note to the top of the list
      setNotes(prev => [event.data.note, ...prev]);
    }

    // Track active jobs for the overlay
    if (event.type === 'job_queued' || event.type === 'job_started') {
      setActiveJobs(prev => {
        // Update if exists, otherwise add
        const exists = prev.find(j => j.data?.jobId === event.data?.jobId);
        if (exists) {
          return prev.map(j => j.data?.jobId === event.data?.jobId ? event : j);
        }
        return [...prev, event];
      });
    } else if (event.type === 'job_done' || event.type === 'job_failed') {
      // Mark as finished but keep for a few seconds to show status
      setActiveJobs(prev => prev.map(j => (j.data?.jobId || j.jobId) === (event.data?.jobId || event.jobId) ? event : j));
      
      setTimeout(() => {
        setActiveJobs(prev => prev.filter(j => (j.data?.jobId || j.jobId) !== (event.data?.jobId || event.jobId)));
      }, 5000);
    }
  }, []);

  useSSE(handleEvent);

  return (
    <div className="container inbox-page">
      <ProcessingOverlay jobs={activeJobs} />
      
      <h1 className="page-title">Inbox</h1>
      
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search your captures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spinner" size={32} />
        </div>
      ) : notes.length > 0 ? (
        <div className="notes-grid">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <InboxIcon size={48} />
          </div>
          <h2>Your inbox is empty</h2>
          <p>Paste a URL or upload a screenshot in the Add tab to get started.</p>
        </div>
      )}

      <style>{`
        .inbox-page {
          padding-top: var(--space-24);
        }
        .search-container {
          position: relative;
          margin-bottom: var(--space-32);
        }
        .search-icon {
          position: absolute;
          left: var(--space-16);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }
        .search-input {
          padding: var(--space-12) var(--space-16) var(--space-12) 48px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-border);
          background: var(--color-bg-warm);
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          outline: none;
          background: white;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 117, 222, 0.1);
        }
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-24);
          padding-bottom: var(--space-48);
        }
        @media (max-width: 600px) {
          .notes-grid {
            grid-template-columns: 1fr;
          }
        }
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
        }
        .empty-icon-circle {
          width: 96px;
          height: 96px;
          background: var(--color-bg-warm);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-20);
          color: var(--color-text-muted);
        }
        .empty-state h2 {
          font-size: 20px;
          margin-bottom: var(--space-8);
        }
        .empty-state p {
          color: var(--color-text-secondary);
          max-width: 300px;
        }
        .spinner {
          animation: spin 1s linear infinite;
          color: var(--color-accent);
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
