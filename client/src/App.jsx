import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import QueueStatus from './components/QueueStatus';
import AddContentSheet from './components/AddContentSheet';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const Inbox       = lazy(() => import('./pages/Inbox'));
const Lists       = lazy(() => import('./pages/Lists'));
const ListView    = lazy(() => import('./pages/ListView'));
const NoteDetail  = lazy(() => import('./pages/NoteDetail'));
const Settings    = lazy(() => import('./pages/Settings'));
const Favorites   = lazy(() => import('./pages/Favorites'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="spinner text-[#33b1ff]" size={32} />
    </div>
  );
}

function App() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  return (
    <Router>
      <div style={{ background: '#f5f7f9', minHeight: '100vh', position: 'relative' }}>
        <main style={{ paddingBottom: '140px' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route index element={<Inbox />} />
              <Route path="lists" element={<Lists />} />
              <Route path="lists/:id" element={<ListView />} />
              <Route path="notes/:id" element={<NoteDetail />} />
              <Route path="settings" element={<Settings />} />
              <Route path="favorites" element={<Favorites />} />
            </Routes>
          </Suspense>
        </main>

        <QueueStatus />
        <BottomNav onAddClick={() => setIsAddSheetOpen(true)} />

        {isAddSheetOpen && (
          <AddContentSheet onClose={() => setIsAddSheetOpen(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
