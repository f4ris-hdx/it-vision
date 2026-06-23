import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
// FIX: Use 'songs'
import { songs } from '../data/db';

export default function Library() {
  const { playTrack } = usePlayer();

  return (
    <div style={{ padding: '24px', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, #450af5, #c4efd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          <i className="fa-solid fa-heart"></i>
        </div>
        <div>
           <h5 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Playlist</h5>
           <h1 style={{ fontSize: '4rem', margin: '5px 0', fontWeight: '800' }}>Liked Songs</h1>
           <p style={{ color: '#b3b3b3' }}>{songs.length} songs • Local Library</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            onClick={() => playTrack(song, songs)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 15px', 
              borderRadius: '5px', cursor: 'pointer', borderBottom: '1px solid #1a1a1a'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ color: '#b3b3b3', width: '20px' }}>{index + 1}</span>
            <img src={song.image} style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '1rem', fontWeight: '500' }}>{song.title}</div>
               <div style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>{song.artist}</div>
            </div>
            <div style={{ marginRight: '20px', color: '#b3b3b3' }}>3:45</div>
          </div>
        ))}
      </div>
    </div>
  );
}