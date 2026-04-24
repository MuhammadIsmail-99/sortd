import { useState, useEffect } from 'react';
import { api } from '../api';
import { Key, Shield, Info, ExternalLink, Check, Loader2 } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data.gemini_api_key) {
          setApiKey('••••••••••••••••');
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.setGeminiKey(apiKey);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container settings-page">
      <h1 className="page-title">Settings</h1>

      <section className="settings-section">
        <div className="section-header">
          <Key size={20} />
          <h2>AI Configuration</h2>
        </div>
        <div className="card settings-card">
          <form onSubmit={handleSaveKey}>
            <div className="form-group">
              <label>Gemini API Key</label>
              <div className="input-with-action">
                <input
                  type="password"
                  placeholder="Enter your Google AI API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="btn-primary" disabled={saving || !apiKey || apiKey === '••••••••••••••••'}>
                  {saving ? <Loader2 className="spinner" size={18} /> : success ? <Check size={18} /> : 'Save'}
                </button>
              </div>
              <p className="hint">
                Required for categorization and summarization. 
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Get a free key here <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-header">
          <Shield size={20} />
          <h2>Privacy & Security</h2>
        </div>
        <div className="card settings-card">
          <div className="settings-item">
            <div className="item-info">
              <h3>Local Processing</h3>
              <p>Your data is processed and stored in your private Supabase instance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-header">
          <Info size={20} />
          <h2>About Sortd</h2>
        </div>
        <div className="card settings-card">
          <div className="settings-item">
            <div className="item-info">
              <h3>Version 1.0.0</h3>
              <p>Built for the Sortd Content Capture Platform.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .settings-page {
          padding-top: var(--space-24);
          max-width: 600px;
        }
        .settings-section {
          margin-bottom: var(--space-48);
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          margin-bottom: var(--space-16);
          color: var(--color-text-secondary);
        }
        .section-header h2 {
          font-size: 18px;
          color: var(--color-text);
        }
        .settings-card {
          padding: var(--space-24);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
        }
        .input-with-action {
          display: flex;
          gap: var(--space-8);
        }
        .input-with-action input {
          flex: 1;
          padding: var(--space-12);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
          background: var(--color-bg-warm);
        }
        .settings-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .item-info h3 {
          font-size: 16px;
          margin-bottom: 4px;
        }
        .item-info p {
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        .hint {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: var(--space-8);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hint a {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
