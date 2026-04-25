import { useState, useEffect } from 'react';
import { api } from '../api';
import ListCard from '../components/ListCard';
import { Plus, Loader2, Folder } from 'lucide-react';

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newList, setNewList] = useState({ name: '', emoji: 'folder', color: '#0075de' });

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

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createList(newList);
      setLists(prev => [...prev, { ...created, note_count: 0 }]);
      setShowCreate(false);
      setNewList({ name: '', emoji: 'folder', color: '#0075de' });
    } catch (err) {
      alert('Failed to create list');
    }
  };

  return (
    <div className="container lists-page">
      <div className="header-row">
        <h1 className="page-title">Lists</h1>
        <button className="btn-primary flex items-center gap-8" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> New List
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spinner" size={32} />
        </div>
      ) : (
        <div className="lists-grid">
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
          <div className="card create-list-card" onClick={() => setShowCreate(true)}>
            <Plus size={32} color="var(--color-text-muted)" />
            <span>Create New</span>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New List</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>List Name</label>
                <input
                  type="text"
                  required
                  value={newList.name}
                  onChange={e => setNewList({ ...newList, name: e.target.value })}
                  placeholder="e.g. Recipes"
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icon</label>
                  <div className="icon-preview">
                    <Folder color={newList.color} size={24} />
                    <span className="text-muted text-sm">Default Folder Icon</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={newList.color}
                    onChange={e => setNewList({ ...newList, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create List</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--space-20);
        }
        .create-list-card {
          padding: var(--space-20);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-8);
          border-style: dashed;
          color: var(--color-text-muted);
          cursor: pointer;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: var(--space-16);
        }
        .modal-content {
          background: white;
          padding: var(--space-32);
          border-radius: var(--radius-card);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: var(--space-24);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          margin-bottom: var(--space-16);
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .form-group input[type="text"] {
          padding: var(--space-12);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-12);
          margin-top: var(--space-8);
        }
        .spinner { animation: spin 1s linear infinite; color: var(--color-accent); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
