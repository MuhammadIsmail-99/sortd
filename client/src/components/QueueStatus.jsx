import { useState, useEffect } from 'react';
import { api } from '../api';
import { Activity, ChevronUp, ChevronDown } from 'lucide-react';

export default function QueueStatus() {
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getQueueStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch queue stats');
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || (stats.pending === 0 && stats.processing === 0)) return null;

  return (
    <div className={`queue-status ${isExpanded ? 'expanded' : ''}`}>
      <div className="queue-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <Activity className="pulse" size={16} />
          <span>Processing {stats.processing} (Queued: {stats.pending})</span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
      
      {isExpanded && (
        <div className="queue-details">
          <div className="stat-row">
            <span>Jobs Done Today</span>
            <span>{stats.done}</span>
          </div>
          <div className="stat-row">
            <span>API Quota</span>
            <span>{stats.rateLimitRemaining} left</span>
          </div>
          <div className="stat-row">
            <span>Failures</span>
            <span className={stats.failed > 0 ? 'text-error' : ''}>{stats.failed}</span>
          </div>
        </div>
      )}

      <style>{`
        .queue-status {
          position: fixed;
          bottom: 80px;
          right: var(--space-16);
          background: var(--color-dark);
          color: white;
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-deep);
          z-index: 1500;
          width: 240px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .queue-header {
          padding: var(--space-12) var(--space-16);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          font-size: 13px;
          font-weight: 600;
        }
        .pulse {
          color: var(--color-success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .queue-details {
          padding: 0 var(--space-16) var(--space-16);
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: var(--space-12);
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          opacity: 0.8;
        }
        .text-error { color: var(--color-error); }
      `}</style>
    </div>
  );
}
