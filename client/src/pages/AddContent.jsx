import { useState, useEffect } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import { Link as LinkIcon, Send, Sparkles } from 'lucide-react';

export default function AddContent() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('text');
    if (sharedUrl) {
      setUrl(sharedUrl);
    }
  }, []);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsProcessing(true);
    try {
      await api.processUrl(url);
      setUrl('');
      navigate('/'); // Go to inbox to see processing status
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await api.processImage(file);
      navigate('/');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="container add-page">
      <h1 className="page-title">Add Content</h1>
      
      <section className="add-section">
        <h2 className="section-title">Paste Link</h2>
        <form onSubmit={handleUrlSubmit} className="url-form">
          <div className="input-wrapper">
            <LinkIcon className="input-icon" size={20} />
            <input
              type="url"
              placeholder="Instagram Reel, YouTube, or web link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" disabled={isProcessing || !url} className="send-btn">
              {isProcessing ? <Sparkles className="pulse" size={20} /> : <Send size={20} />}
            </button>
          </div>
          <p className="hint">Works best with Instagram Reels and YouTube Shorts</p>
        </form>
      </section>

      <div className="divider">
        <span>OR</span>
      </div>

      <section className="add-section">
        <h2 className="section-title">Upload Screenshot</h2>
        <UploadZone onUpload={handleFileUpload} />
        <p className="hint">We'll use OCR to extract text and categorize the content</p>
      </section>

      <style>{`
        .add-page {
          padding-top: var(--space-24);
          max-width: 600px;
        }
        .add-section {
          margin-bottom: var(--space-48);
        }
        .url-form .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .url-form .input-icon {
          position: absolute;
          left: var(--space-16);
          color: var(--color-text-muted);
        }
        .url-form input {
          padding: var(--space-16) 60px var(--space-16) 48px;
          border-radius: var(--radius-card);
          border: 1px solid var(--color-border);
          background: var(--color-bg-warm);
          font-weight: 500;
        }
        .url-form input:focus {
          outline: none;
          background: white;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 117, 222, 0.1);
        }
        .send-btn {
          position: absolute;
          right: 8px;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--color-accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .send-btn:disabled {
          background: var(--color-text-muted);
          cursor: not-allowed;
        }
        .hint {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: var(--space-12);
        }
        .divider {
          display: flex;
          align-items: center;
          gap: var(--space-16);
          margin-bottom: var(--space-48);
          color: var(--color-text-muted);
          font-size: 12px;
          font-weight: 700;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
