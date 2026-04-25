import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api';
import NoteCard from '../components/NoteCard';
import ProcessingOverlay from '../components/ProcessingOverlay';
import ManageListsSheet from '../components/ManageListsSheet';
import { FolderIcon } from '../components/icons';
import { useSSE } from '../hooks/useSSE';
import { Search, Filter, Loader2, Inbox as InboxIcon } from 'lucide-react';

const PLACEHOLDER_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sortd';
const PINNED_KEY = 'sortd_pinned_lists';

function getPinnedIds() {
  try {
    const s = localStorage.getItem(PINNED_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function Inbox() {
  // ── existing data state ───────────────────────────────
  const [notes, setNotes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeJobs, setActiveJobs] = useState([]);

  // ── new UI state ──────────────────────────────────────
  const [lists, setLists]             = useState([]);
  const [pinnedIds, setPinnedIds]     = useState(getPinnedIds);
  const [isManaging, setIsManaging]   = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  const searchRef                     = useRef(null);

  // ── data fetching ─────────────────────────────────────
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

  const fetchLists = async () => {
    try { setLists(await api.getLists()); }
    catch (err) { console.error('Failed to fetch lists'); }
  };

  useEffect(() => { fetchNotes(); }, [search]);
  useEffect(() => { fetchLists(); }, []);

  // ── toggle starred on a note ──────────────────────────
  const handleToggleFavorite = async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    try {
      const updated = await api.updateNote(noteId, { starred: !note.starred });
      setNotes(prev => prev.map(n => n.id === noteId ? updated : n));
    } catch (err) {
      console.error('Failed to toggle favourite');
    }
  };

  // ── manage which lists appear in the folder grid ──────
  const handleToggleListInInbox = (listId) => {
    const current    = pinnedIds ?? lists.map(l => l.id);
    const newPinned  = current.includes(listId)
      ? current.filter(id => id !== listId)
      : [...current, listId];
    setPinnedIds(newPinned);
    localStorage.setItem(PINNED_KEY, JSON.stringify(newPinned));
  };

  const listsWithVisibility = lists.map(l => ({
    ...l,
    showInInbox: pinnedIds === null ? true : pinnedIds.includes(l.id),
  }));
  const visibleLists = listsWithVisibility.filter(l => l.showInInbox).slice(0, 6);

  // ── SSE job lifecycle (unchanged logic) ───────────────
  const handleEvent = useCallback((event) => {
    if (event.type === 'job_done') {
      setNotes(prev => [event.data.note, ...prev]);
    }
    if (event.type === 'job_queued' || event.type === 'job_started') {
      setActiveJobs(prev => {
        const exists = prev.find(j => j.data?.jobId === event.data?.jobId);
        if (exists) return prev.map(j => j.data?.jobId === event.data?.jobId ? event : j);
        return [...prev, event];
      });
    } else if (event.type === 'job_done' || event.type === 'job_failed') {
      setActiveJobs(prev =>
        prev.map(j =>
          (j.data?.jobId || j.jobId) === (event.data?.jobId || event.jobId) ? event : j
        )
      );
      setTimeout(() => {
        setActiveJobs(prev =>
          prev.filter(j =>
            (j.data?.jobId || j.jobId) !== (event.data?.jobId || event.jobId)
          )
        );
      }, 5000);
    }
  }, []);

  useSSE(handleEvent);

  // ── search toggle helper ──────────────────────────────
  const toggleSearch = () => {
    setShowSearch(s => {
      if (!s) setTimeout(() => searchRef.current?.focus(), 50);
      return !s;
    });
  };

  return (
    <div style={{ padding: '48px 24px 32px', maxWidth: '680px', margin: '0 auto' }}>
      <ProcessingOverlay jobs={activeJobs} />

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src={PLACEHOLDER_AVATAR}
            alt="avatar"
            className="w-10 h-10 rounded-full"
            style={{ border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} />
          <span style={{ fontSize: '14px', fontWeight: 800, opacity: 0.2, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Sortd
          </span>
        </div>

        <button
          onClick={toggleSearch}
          className="p-2 rounded-full neo-shadow transition-all active:scale-95"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          <Search size={20} style={{ color: 'rgba(0,0,0,0.3)' }} />
        </button>
      </div>

      {/* ── Search input (toggleable) ─────────────────── */}
      {showSearch && (
        <div style={{ marginBottom: '24px' }}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search your captures..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-flat"
          />
        </div>
      )}

      {/* ── Folder grid ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', color: '#1a1d1f' }}>
          Your Lists
        </h2>
        <button
          onClick={() => setIsManaging(true)}
          className="flex items-center gap-1 transition-colors"
          style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.3)' }}
        >
          Manage <Filter size={12} />
        </button>
      </div>

      {visibleLists.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {visibleLists.map(l => (
            <div
              key={l.id}
              className="folder-card flex flex-col gap-3 relative overflow-hidden"
              style={{ background: l.color || '#a2d2ff' }}
            >
              <span
                className="absolute top-3 right-3 font-bold"
                style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}
              >
                {l.note_count ?? 0}
              </span>
              <FolderIcon color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', letterSpacing: '-0.2px' }}>
                {l.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center mb-8"
          style={{
            border: '1px dashed rgba(0,0,0,0.12)',
            borderRadius: '16px',
            padding: '24px',
            background: 'rgba(255,255,255,0.5)',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.3)' }}>
            No lists selected
          </p>
          <button
            onClick={() => setIsManaging(true)}
            style={{ fontSize: '12px', fontWeight: 700, color: '#33b1ff', marginTop: '4px' }}
          >
            Configure
          </button>
        </div>
      )}

      {/* ── Recent Clips ──────────────────────────────── */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', color: '#1a1d1f', marginBottom: '16px' }}>
        Recent Clips
      </h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Loader2 size={32} className="spinner" style={{ color: '#33b1ff' }} />
        </div>
      ) : notes.length > 0 ? (
        notes.map(note => (
          <NoteCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
        ))
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', opacity: 0.25 }}
        >
          <InboxIcon size={56} strokeWidth={1} />
          <p style={{ marginTop: '16px', fontWeight: 700 }}>Your inbox is empty</p>
          <p style={{ fontSize: '14px', marginTop: '4px', textAlign: 'center', maxWidth: '260px', color: '#6f767e' }}>
            Paste a URL or upload a screenshot in the Add tab
          </p>
        </div>
      )}

      {/* ── Manage Lists sheet ────────────────────────── */}
      {isManaging && (
        <ManageListsSheet
          lists={listsWithVisibility}
          onToggle={handleToggleListInInbox}
          onClose={() => setIsManaging(false)}
        />
      )}
    </div>
  );
}
