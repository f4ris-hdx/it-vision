import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export default function RightSection() {
  const { queue, currentTrack, playTrack } = usePlayer();

  // CONSTRAINT 1: Only visible if music is playing (Queue has items)
  if (!queue || queue.length === 0) return null;

  return (
    <aside className="right-section">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', color: 'white', position:'sticky', top:0, background:'#000', paddingBottom:'10px', zIndex:10 }}>Queue</h3>
      
      <div className="queue-list">
        {queue.map((song, index) => (
          <div 
            key={`${song.id}-${index}`}
            onClick={() => playTrack(song)}
            className="queue-item"
            style={{ 
              opacity: currentTrack?.id === song.id ? 1 : 0.6,
              background: currentTrack?.id === song.id ? '#1a1a1a' : 'transparent' 
            }}
          >
            <span style={{ width: '20px', fontSize: '0.8rem', color: '#1db954', textAlign:'center' }}>
              {currentTrack?.id === song.id ? <i className="fa-solid fa-volume-high"></i> : index + 1}
            </span>
            <img src={song.image} alt={song.title} />
            <div className="info">
              <div className="title" style={{ color: currentTrack?.id === song.id ? '#1db954' : 'white' }}>
                {song.title}
              </div>
              <div className="artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .right-section {
          width: 280px;
          background: #000;
          padding: 20px;
          border-left: 1px solid #1a1a1a;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          flex-shrink: 0; /* Prevent squishing */
        }

        .queue-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          cursor: pointer;
          transition: 0.2s;
          border-radius: 6px;
        }
        .queue-item:hover {
          background: #282828 !important;
          opacity: 1 !important;
        }
        .queue-item img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
        }
        .info { overflow: hidden; }
        .title {
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .artist { font-size: 0.75rem; color: #b3b3b3; }

        /* CONSTRAINT 2: Hide on Tablet & Mobile (Width < 1024px) */
        @media (max-width: 1024px) {
          .right-section { display: none; }
        }
      `}</style>
    </aside>
  );
}
