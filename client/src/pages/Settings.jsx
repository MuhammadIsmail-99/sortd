import { Shield, Info } from 'lucide-react';

export default function Settings() {
  return (
    <div className="container settings-page">
      <h1 className="page-title">Settings</h1>

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
      `}</style>
    </div>
  );
}
