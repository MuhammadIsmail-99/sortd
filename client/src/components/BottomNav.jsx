import { NavLink } from 'react-router-dom';
import { Inbox, Folder, PlusCircle, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', label: 'Inbox', icon: Inbox },
    { to: '/lists', label: 'Lists', icon: Folder },
    { to: '/add', label: 'Add', icon: PlusCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: white;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom: env(safe-area-inset-bottom);
          z-index: 1000;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--color-text-muted);
          text-decoration: none;
          flex: 1;
          height: 100%;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .nav-item span {
          font-size: 12px;
          font-weight: 600;
        }
        .nav-item.active {
          color: var(--color-accent);
          background: rgba(0, 117, 222, 0.05);
        }
      `}</style>
    </nav>
  );
}
