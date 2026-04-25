import { useState } from 'react';
import { Bell, Lock, Smartphone, Globe, LogOut, Camera, ChevronRight } from 'lucide-react';

const DEFAULT_USER = {
  name: 'You',
  email: 'user@sortd.io',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sortd',
};

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sortd',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
];

const SETTINGS_ROWS = [
  { icon: <Bell size={18} />,       label: 'Notifications',    value: 'On',      bg: '#eff6ff', fg: '#3b82f6' },
  { icon: <Lock size={18} />,       label: 'Privacy & Security',               bg: '#fff7ed', fg: '#f97316' },
  { icon: <Smartphone size={18} />, label: 'Connected Devices', value: '1',     bg: '#faf5ff', fg: '#a855f7' },
  { icon: <Globe size={18} />,      label: 'Language',          value: 'English', bg: '#f0fdf4', fg: '#22c55e' },
  { icon: <LogOut size={18} />,     label: 'Logout',                             bg: '#fff1f2', fg: '#ef4444' },
];

function loadUser() {
  try {
    const s = localStorage.getItem('sortd_user');
    return s ? JSON.parse(s) : DEFAULT_USER;
  } catch { return DEFAULT_USER; }
}

export default function Settings() {
  const [user, setUser]       = useState(loadUser);
  const [editing, setEditing] = useState(false);
  const [temp, setTemp]       = useState({ ...user });

  const handleSave = () => {
    setUser(temp);
    localStorage.setItem('sortd_user', JSON.stringify(temp));
    setEditing(false);
  };

  const handleCancel = () => {
    setTemp({ ...user });
    setEditing(false);
  };

  return (
    <div style={{ padding: '48px 24px 32px', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1a1d1f', marginBottom: '32px' }}>
        Profile
      </h1>

      {/* ── Avatar card ─────────────────────────────── */}
      <div
        className="bg-white neo-shadow flex flex-col items-center mb-6"
        style={{ borderRadius: '32px', padding: '32px' }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <img
            src={editing ? temp.avatar : user.avatar}
            alt="profile"
            style={{
              width: '96px', height: '96px',
              borderRadius: '50%',
              border: '4px solid #f5f7f9',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: 0, right: 0,
              padding: '8px', background: '#1a1d1f', color: 'white',
              borderRadius: '50%', border: '2px solid white',
            }}
          >
            <Camera size={14} />
          </div>
        </div>

        {editing ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {/* Avatar picker */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setTemp({ ...temp, avatar: av })}
                  style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%',
                    border: `2px solid ${temp.avatar === av ? '#33b1ff' : 'transparent'}`,
                    opacity: temp.avatar === av ? 1 : 0.5,
                    transform: temp.avatar === av ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s',
                    overflow: 'hidden',
                    padding: 0,
                  }}
                >
                  <img src={av} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </button>
              ))}
            </div>

            <input
              className="input-flat"
              placeholder="Name"
              value={temp.name}
              onChange={e => setTemp({ ...temp, name: e.target.value })}
            />
            <input
              className="input-flat"
              placeholder="Email"
              value={temp.email}
              onChange={e => setTemp({ ...temp, email: e.target.value })}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1, padding: '16px', borderRadius: '16px',
                  fontWeight: 700, fontSize: '14px', background: '#f5f7f9',
                }}
              >
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '16px', fontSize: '14px' }}>
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.3px' }}>{user.name}</h2>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(0,0,0,0.3)', marginTop: '4px' }}>
              {user.email}
            </p>
            <button
              onClick={() => { setTemp({ ...user }); setEditing(true); }}
              style={{
                marginTop: '24px', padding: '8px 24px',
                borderRadius: '999px', background: '#f5f7f9',
                fontSize: '11px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'rgba(0,0,0,0.5)',
                transition: 'all 0.2s',
              }}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Settings rows ────────────────────────────── */}
      <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.3)', marginBottom: '16px', paddingLeft: '8px' }}>
        Account Settings
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SETTINGS_ROWS.map((item, idx) => (
          <button
            key={idx}
            className="bg-white neo-shadow flex items-center justify-between transition-all active:scale-[0.98]"
            style={{ borderRadius: '24px', padding: '20px', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.bg, color: item.fg,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontWeight: 800, fontSize: '15px', color: '#1a1d1f' }}>{item.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.value && (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.2)' }}>{item.value}</span>
              )}
              <ChevronRight size={16} style={{ color: 'rgba(0,0,0,0.12)' }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
