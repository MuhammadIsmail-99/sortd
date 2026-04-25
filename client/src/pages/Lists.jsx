import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { FolderIcon } from '../components/icons';
import { Plus, Loader2, X } from 'lucide-react';

const PALETTE = ['#a2d2ff', '#88e1ff', '#bde0fe', '#c8b6ff', '#ffc8dd', '#b9fbc0', '#ffcfd2', '#ffd6a5'];

export default function Lists() {
  const [lists, setLists]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newList, setNewList]     = useState({ name: '', color: '#a2d2ff' });
  const navigate                  = useNavigate();

  const fetchLists = async () => {
    try {
      const data = await api.getLists();
      setLists(data);
    } catch (err) {
      console.error('Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createList(newList);
      setLists(prev => [...prev, { ...created, note_count: 0 }]);
      setShowCreate(false);
      setNewList({ name: '', color: '#a2d2ff' });
    } catch (err) {
      alert('Failed to create list');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} className="spinner" style={{ color: '#33b1ff' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 24px 32px', maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1a1d1f' }}>
          Collections
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center neo-shadow transition-all active:scale-95"
          style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Plus size={20} style={{ color: '#1a1d1f' }} />
        </button>
      </div>

      {/* 2-column folder grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {lists.map(l => (
          <div
            key={l.id}
            onClick={() => navigate(`/lists/${l.id}`)}
            className="folder-card relative overflow-hidden flex flex-col justify-between"
            style={{
              background: l.color || '#a2d2ff',
              aspectRatio: '1',
              padding: '20px',
            }}
          >
            <span
              className="absolute font-bold"
              style={{ top: '20px', right: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}
            >
              {l.note_count ?? 0}
            </span>
            <FolderIcon color="white" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              {l.name}
            </h3>
          </div>
        ))}

        {/* Create new card */}
        <button
          onClick={() => setShowCreate(true)}
          className="folder-card flex flex-col items-center justify-center gap-2"
          style={{
            background: '#f5f7f9',
            aspectRatio: '1',
            padding: '20px',
            border: '2px dashed rgba(0,0,0,0.1)',
          }}
        >
          <Plus size={32} style={{ color: 'rgba(0,0,0,0.2)' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(0,0,0,0.3)' }}>Create New</span>
        </button>
      </div>

      {/* Create list bottom sheet */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center modal-overlay"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white w-full max-w-2xl neo-shadow bottom-sheet-anim"
            style={{ borderRadius: '40px 40px 0 0', padding: '16px 24px 0' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div
              className="mx-auto mb-6"
              style={{ width: '48px', height: '6px', borderRadius: '999px', background: 'rgba(0,0,0,0.05)' }}
            />

            {/* Sheet header */}
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.4px', color: '#1a1d1f' }}>
                New Collection
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 rounded-full"
                style={{ background: '#f5f7f9' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                required
                autoFocus
                className="input-flat"
                placeholder="Collection name..."
                value={newList.name}
                onChange={e => setNewList({ ...newList, name: e.target.value })}
              />

              {/* Color picker */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.4)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Colour
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {PALETTE.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewList({ ...newList, color: c })}
                      style={{
                        width: '36px', height: '36px',
                        borderRadius: '10px',
                        background: c,
                        border: newList.color === c ? '3px solid #1a1d1f' : '3px solid transparent',
                        transition: 'transform 0.15s',
                        transform: newList.color === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingBottom: '32px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={{
                    flex: 1, padding: '16px', borderRadius: '16px',
                    fontWeight: 700, fontSize: '14px', background: '#f5f7f9',
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '16px', fontSize: '14px' }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
