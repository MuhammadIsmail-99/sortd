import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inbox from './pages/Inbox';
import Lists from './pages/Lists';
import ListView from './pages/ListView';
import AddContent from './pages/AddContent';
import NoteDetail from './pages/NoteDetail';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import BottomNav from './components/BottomNav';
import QueueStatus from './components/QueueStatus';

function App() {
  return (
    <Router>
      <div style={{ background: '#f5f7f9', minHeight: '100vh' }}>
        <main style={{ paddingBottom: '140px' }}>
          <Routes>
            <Route index element={<Inbox />} />
            <Route path="lists" element={<Lists />} />
            <Route path="lists/:id" element={<ListView />} />
            <Route path="add" element={<AddContent />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="favorites" element={<Favorites />} />
          </Routes>
        </main>

        <QueueStatus />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
