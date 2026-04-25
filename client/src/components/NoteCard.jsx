import { Link } from 'react-router-dom';
import { Heart, Video, PlayCircle, Link as LinkIcon } from 'lucide-react';
import { SourceIcon } from './icons';

const PLATFORM_COLORS = {
  youtube:   '#FF0000',
  instagram: '#E1306C',
  tiktok:    '#69C9D0',
};

export default function NoteCard({ note, onToggleFavorite }) {
  const platform    = (note.source_platform || '').toLowerCase();
  const accentColor = PLATFORM_COLORS[platform] || '#33b1ff';
  const isVideo     = note.source_type === 'url';
  const isFavorite  = note.starred;

  return (
    <Link
      to={`/notes/${note.id}`}
      className="block mb-4"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="bg-white rounded-[24px] p-4 neo-shadow transition-all cursor-pointer relative"
        style={{
          borderLeft: `4px solid ${accentColor}`,
          border: `1px solid transparent`,
          borderLeftWidth: '4px',
          borderLeftColor: accentColor,
        }}
      >
        <div className="flex gap-4">
          {/* Thumbnail */}
          {note.thumbnail ? (
            <div className="relative flex-shrink-0">
              <img
                src={note.thumbnail}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover"
              />
              {isVideo && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(0,0,0,0.25)', color: 'white' }}
                >
                  <PlayCircle size={24} />
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#f5f7f9' }}
            >
              {isVideo
                ? <Video size={24} style={{ color: '#a39e98' }} />
                : <LinkIcon size={24} style={{ color: '#a39e98' }} />
              }
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden" style={{ paddingRight: '36px' }}>
            {/* Source chip */}
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="p-1.5 rounded-full flex items-center justify-center"
                style={{ background: isVideo ? '#98fb98' : '#a2d2ff' }}
              >
                <SourceIcon source={note.source_platform} size={10} />
              </div>
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}
              >
                {note.source_platform || 'manual'}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-[16px] font-extrabold mb-1 tracking-tight leading-tight truncate"
              style={{ color: '#1a1d1f' }}
            >
              {note.title || 'Untitled Note'}
            </h3>

            {/* Excerpt */}
            <p
              className="text-[13px] leading-snug"
              style={{
                color: 'rgba(0,0,0,0.5)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {note.content}
            </p>
          </div>
        </div>

        {/* Heart / favourite button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isFavorite ? 'heart-pop' : ''}`}
            style={{ color: isFavorite ? '#f43f5e' : 'rgba(0,0,0,0.12)' }}
          >
            <Heart
              size={20}
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>
    </Link>
  );
}
