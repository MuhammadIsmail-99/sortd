import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProcessingOverlay({ jobs }) {
  if (jobs.length === 0) return null;

  return (
    <div className="processing-container">
      <AnimatePresence>
        {jobs.map((job) => (
          <motion.div
            key={job.jobId}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`job-toast ${job.type === 'job_failed' ? 'failed' : job.type === 'job_done' ? 'done' : ''}`}
          >
            <div className="job-info">
              {job.type === 'job_queued' || job.type === 'job_started' ? (
                <Loader2 className="spinner" size={20} />
              ) : job.type === 'job_done' ? (
                <CheckCircle2 className="success-icon" size={20} />
              ) : (
                <AlertCircle className="error-icon" size={20} />
              )}
              
              <div className="job-text">
                <span className="job-label">
                  {job.type === 'job_queued' ? 'Queued' : 
                   job.type === 'job_started' ? (job.data.step || 'Processing') :
                   job.type === 'job_done' ? 'Complete' : 'Failed'}
                </span>
                {job.type === 'job_done' && (
                  <Link to={`/notes/${job.data.note.id}`} className="view-link">
                    View Note <ArrowRight size={14} />
                  </Link>
                )}
                {job.type === 'job_failed' && (
                  <span className="error-msg">{job.data.error}</span>
                )}
              </div>
            </div>
            
            {job.type === 'job_started' && (
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, ease: "linear" }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <style>{`
        .processing-container {
          position: fixed;
          top: var(--space-16);
          left: 50%;
          transform: translateX(-50%);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          width: calc(100% - 32px);
          max-width: 400px;
        }
        .job-toast {
          background: var(--color-dark);
          color: white;
          padding: var(--space-12) var(--space-16);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-deep);
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          overflow: hidden;
        }
        .job-toast.done { background: var(--color-success); }
        .job-toast.failed { background: var(--color-error); }
        
        .job-info {
          display: flex;
          align-items: center;
          gap: var(--space-12);
        }
        .job-text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
        }
        .job-label {
          font-weight: 700;
          text-transform: capitalize;
          font-size: 14px;
        }
        .view-link {
          color: white;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: underline;
        }
        .error-msg {
          font-size: 12px;
          opacity: 0.9;
        }
        .progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: white;
          width: 10%;
        }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
