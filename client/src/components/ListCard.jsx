import { Link } from 'react-router-dom';

export default function ListCard({ list }) {
  const { id, name, emoji, color, note_count } = list;

  return (
    <Link to={`/lists/${id}`} className="card list-card" style={{ '--list-color': color }}>
      <div className="list-emoji">{emoji}</div>
      <div className="list-info">
        <h3 className="list-name">{name}</h3>
        <span className="pill-badge">{note_count || 0}</span>
      </div>
      <style>{`
        .list-card {
          padding: var(--space-20);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-12);
          text-align: center;
          border-bottom: 3px solid var(--list-color);
        }
        .list-emoji {
          font-size: 32px;
        }
        .list-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }
        .list-name {
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </Link>
  );
}
