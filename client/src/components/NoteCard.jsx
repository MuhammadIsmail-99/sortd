import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import TagPill from './TagPill';

export default function NoteCard({ note }) {
  const { id, title, content, thumbnail, source_platform, starred, created_at, tags } = note;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <Link to={`/notes/${id}`} className="card note-card">
      {thumbnail && (
        <div className="card-image">
          <img src={thumbnail} alt={title} loading="lazy" />
        </div>
      )}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title || 'Untitled Note'}</h3>
          {starred && <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />}
        </div>
        
        <p className="card-excerpt">{content}</p>
        
        <div className="card-footer">
          <div className="card-meta">
            <span className="source-badge">{source_platform || 'manual'}</span>
            <span className="timestamp">
              <Clock size={12} />
              {formatDate(created_at)}
            </span>
          </div>
          <div className="card-tags">
            {tags && tags.slice(0, 2).map(tag => (
              <TagPill key={tag} name={tag} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .note-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }
        .card-image {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--color-bg-warm);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-content {
          padding: var(--space-16);
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-8);
        }
        .card-title {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.33;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-excerpt {
          font-size: 14px;
          color: var(--color-text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }
        .card-footer {
          margin-top: var(--space-8);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-meta {
          display: flex;
          align-items: center;
          gap: var(--space-12);
        }
        .source-badge {
          text-transform: capitalize;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-accent);
          background: var(--color-badge-bg);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .timestamp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-text-muted);
        }
        .card-tags {
          display: flex;
          gap: 4px;
        }
      `}</style>
    </Link>
  );
}
