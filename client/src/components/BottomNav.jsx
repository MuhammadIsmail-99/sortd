import { NavLink, useNavigate } from 'react-router-dom';
import { Inbox, FolderOpen, Plus, Star, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Action Button */}
      <div
        className="fixed z-[60]"
        style={{ bottom: '62px', left: '50%', transform: 'translateX(-50%)' }}
      >
        <button
          onClick={() => navigate('/add')}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: '#1a1d1f',
            color: 'white',
            border: '4px solid #f5f7f9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
          }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Dock */}
      <div
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
        style={{ padding: '0 16px' }}
      >
        <nav
          className="w-full max-w-2xl neo-shadow"
          style={{
            height: '72px',
            background: 'white',
            borderRadius: '32px',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <NavLink
            to="/"
            end
            className="flex justify-center items-center h-full transition-colors"
            style={({ isActive }) => ({ color: isActive ? '#33b1ff' : 'rgba(0,0,0,0.2)' })}
          >
            {({ isActive }) => <Inbox size={24} strokeWidth={isActive ? 2.5 : 2} />}
          </NavLink>

          <NavLink
            to="/lists"
            className="flex justify-center items-center h-full transition-colors"
            style={({ isActive }) => ({ color: isActive ? '#33b1ff' : 'rgba(0,0,0,0.2)' })}
          >
            {({ isActive }) => <FolderOpen size={24} strokeWidth={isActive ? 2.5 : 2} />}
          </NavLink>

          {/* FAB spacer */}
          <div />

          <NavLink
            to="/favorites"
            className="flex justify-center items-center h-full transition-colors"
            style={({ isActive }) => ({ color: isActive ? '#33b1ff' : 'rgba(0,0,0,0.2)' })}
          >
            {({ isActive }) => <Star size={24} strokeWidth={isActive ? 2.5 : 2} />}
          </NavLink>

          <NavLink
            to="/settings"
            className="flex justify-center items-center h-full transition-colors"
            style={({ isActive }) => ({ color: isActive ? '#33b1ff' : 'rgba(0,0,0,0.2)' })}
          >
            {({ isActive }) => <User size={24} strokeWidth={isActive ? 2.5 : 2} />}
          </NavLink>
        </nav>
      </div>
    </>
  );
}
