import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { albums, songs } from '../data/db'; 

export default function AlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, currentTrack } = usePlayer();

  const albumInfo = albums.find(a => a.title === id);
  
  // --- THE FIX: FILTER AND SORT BY TRACK NUMBER ---
  const albumSongs = songs
    .filter(s => s.album === id)
    .sort((a, b) => a.trackNumber - b.trackNumber); // <--- SORTS 1, 2, 3...

  if (!albumInfo) return <h1 style={{padding:'40px', color:'white'}}>Album not found</h1>;

  return (
    <div className="page-container">
      
      {/* Back Button */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      <div className="album-header">
        <img src={albumInfo.image} className="album-cover" alt="" />
        <div className="album-meta">
          <h4>Album</h4>
          <h1>{albumInfo.title}</h1>
          <div className="meta-text">
            <b>{albumInfo.artist}</b> • {albumInfo.year} • {albumSongs.length} songs
          </div>
        </div>
      </div>

      <div className="song-list">
        <div className="play-row">
           <div className="play-fab" onClick={() => albumSongs.length > 0 && playTrack(albumSongs[0], albumSongs)}>
              <i className="fa-solid fa-play"></i>
           </div>
        </div>

        {albumSongs.map((song, i) => (
          <div key={song.id} className="song-row" onClick={() => playTrack(song, albumSongs)}>
             <span className="index">
               {currentTrack?.id === song.id ? <i className="fa-solid fa-chart-simple" style={{color:'#1db954'}}></i> : song.trackNumber || i + 1}
             </span>
             <div className="info">
                <div className="title" style={{color: currentTrack?.id === song.id ? '#1db954' : 'white'}}>{song.title}</div>
                <div className="artist">{song.artist}</div>
             </div>
             <span className="time">3:20</span>
          </div>
        ))}
      </div>

      <style>{`
        .page-container { color: white; padding-bottom: 120px; position: relative; }
        
        .back-btn { 
          position: absolute; top: 20px; left: 20px; 
          width: 40px; height: 40px; border-radius: 50%; 
          background: rgba(0,0,0,0.5); display: grid; place-items: center; 
          cursor: pointer; z-index: 100; transition: 0.2s;
        }
        .back-btn:hover { background: #000; }
        .back-btn i { font-size: 1.2rem; color: white; }

        .album-header { display: flex; align-items: flex-end; gap: 30px; padding: 60px 40px 40px 40px; background: linear-gradient(to bottom, #444, #121212); }
        .album-cover { width: 230px; height: 230px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .album-meta h1 { font-size: 4rem; font-weight: 800; margin: 10px 0; }
        .meta-text { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }

        .song-list { padding: 20px 40px; background: #121212; min-height: 50vh; }
        .play-row { margin-bottom: 30px; }
        .play-fab { width: 56px; height: 56px; background: #1db954; border-radius: 50%; display: grid; place-items: center; color: black; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .play-fab:hover { transform: scale(1.05); }
        .play-fab i { transform: translateX(2px); }

        .song-row { display: flex; align-items: center; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
        .song-row:hover { background: rgba(255,255,255,0.1); }
        .index { width: 40px; color: #aaa; text-align: center; font-size: 1rem; }
        .info { flex: 1; }
        .title { font-size: 1rem; font-weight: 500; }
        .artist { font-size: 0.85rem; color: #aaa; }
        .time { color: #aaa; font-size: 0.9rem; }

        @media (max-width: 768px) {
          .album-header { flex-direction: column; align-items: center; text-align: center; padding-top: 80px; }
          .album-meta h1 { font-size: 2.5rem; }
          .song-list { padding: 10px; }
        }
      `}</style>
    </div>
  );
}
