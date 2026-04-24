import { useEffect, useRef } from 'react';

const SSE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/events';

/**
 * Enhanced SSE hook that uses a callback pattern to avoid re-render loops
 * @param {Function} onEvent - Callback called when any event arrives
 */
export function useSSE(onEvent) {
  const onEventRef = useRef(onEvent);
  
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const es = new EventSource(SSE_URL);

    const eventNames = ['job_queued', 'job_started', 'job_done', 'job_failed', 'watch_status'];
    
    const handler = (name) => (e) => {
      const data = JSON.parse(e.data);
      if (onEventRef.current) {
        onEventRef.current({ type: name, data });
      }
    };

    eventNames.forEach(name => {
      es.addEventListener(name, handler(name));
    });

    es.onopen = () => console.log('✅ SSE Connected');
    es.onerror = (err) => {
      console.error('❌ SSE Error:', err);
      // EventSource automatically retries, but we log it
    };

    return () => {
      es.close();
      console.log('🔌 SSE Disconnected');
    };
  }, []);
}
