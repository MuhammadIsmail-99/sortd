import { Link } from 'react-router-dom';

export default function TagPill({ name, onClick }) {
  if (onClick) {
    return (
      <button className="pill-badge" onClick={() => onClick(name)}>
        {name}
      </button>
    );
  }

  return (
    <Link to={`/?tag=${encodeURIComponent(name)}`} className="pill-badge">
      {name}
    </Link>
  );
}
