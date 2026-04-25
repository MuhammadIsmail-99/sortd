import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { FolderIcon } from '../components/icons';
import { Loader2 } from 'lucide-react';

export default function Lists() {
  const [lists, setLists]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const data = await api.getLists();
        setLists(data);
      } catch (err) {
        console.error('Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  return (
    <div className="px-6 md:px-12 pt-12 pb-32 w-full max-w-5xl mx-auto">
      <h1 className="text-[32px] md:text-[42px] font-black tracking-tighter text-[#1a1d1f] mb-8">Collections</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="spinner text-[#33b1ff]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {lists.map(l => (
            <Link
              key={l.id}
              to={`/lists/${l.id}`}
              className="folder-card flex flex-col gap-4 relative overflow-hidden aspect-square justify-between p-6 transition-all hover:scale-[1.02]"
              style={{ background: l.color || '#33b1ff' }}
            >
              <div className="text-[12px] font-black text-white absolute top-6 right-6">
                {l.note_count ?? 0}
              </div>
              <FolderIcon color="white" size={32} />
              <h3 className="text-[20px] font-black text-white tracking-tight leading-tight">
                {l.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
