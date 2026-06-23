import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { playlists, songs } from '../data/db'; 

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, currentTrack } = usePlayer();

  const playlist = playlists.find(p => p.id === id);
  const playlistSongs = playlist 
    ? playlist.songIds.map(sId => songs.find(s => s.id === sId)).filter(Boolean) 
    : [];

  if (!playlist) return <h1 style={{padding:'40px', color:'white'}}>Playlist Not Found</h1>;

  return (
    <div className="page-container">
      
      {/* --- BACK BUTTON --- */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      <div className="album-header" style={{background: 'linear-gradient(to bottom, #4a00e0, #121212)'}}>
        <img src={playlist.image} className="album-cover" alt="" />
        <div className="album-meta">
          <h4 style={{textTransform:'uppercase', fontSize:'0.8rem'}}>Playlist</h4>
          <h1>{playlist.title}</h1>
          <p style={{color:'#ccc'}}>{playlist.description}</p>
          <div className="meta-text">
            <b>{playlist.owner}</b> • {playlistSongs.length} songs
          </div>
        </div>
      </div>

      <div className="song-list">
        <div className="play-row">
           <div className="play-fab" onClick={() => playlistSongs.length > 0 && playTrack(playlistSongs[0], playlistSongs)}>
              <i className="fa-solid fa-play"></i>
           </div>
        </div>

        {playlistSongs.map((song, i) => (
          <div key={song.id} className="song-row" onClick={() => playTrack(song, playlistSongs)}>
             <span className="index">{currentTrack?.id === song.id ? <i className="fa-solid fa-chart-simple" style={{color:'#1db954'}}></i> : i+1}</span>
             <img src={song.image} style={{width:'40px', height:'40px', marginRight:'15px', borderRadius:'4px'}} alt=""/>
             <div className="info">
                <div className="title" style={{color: currentTrack?.id === song.id ? '#1db954' : 'white'}}>{song.title}</div>
                <div className="artist">{song.artist}</div>
             </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .page-container { color: white; padding-bottom: 120px; position: relative; }
        
        /* BACK BUTTON STYLE */
        .back-btn { 
          position: absolute; top: 20px; left: 20px; 
          width: 40px; height: 40px; border-radius: 50%; 
          background: rgba(0,0,0,0.5); display: grid; place-items: center; 
          cursor: pointer; z-index: 100; transition: 0.2s;
        }
        .back-btn:hover { background: #000; }
        .back-btn i { font-size: 1.2rem; color: white; }

        .album-header { display: flex; align-items: flex-end; gap: 30px; padding: 60px 40px 40px 40px; }
        .album-cover { width: 230px; height: 230px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .album-meta h1 { font-size: 3.5rem; font-weight: 800; margin: 10px 0; }
        .meta-text { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }

        .song-list { padding: 20px 40px; background: #121212; min-height: 50vh; }
        .play-row { margin-bottom: 30px; }
        .play-fab { width: 56px; height: 56px; background: #1db954; border-radius: 50%; display: grid; place-items: center; color: black; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .play-fab:hover { transform: scale(1.05); }
        .play-fab i { transform: translateX(2px); }

        .song-row { display: flex; align-items: center; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
        .song-row:hover { background: rgba(255,255,255,0.1); }
        .index { width: 40px; color: #aaa; text-align: center; }
        .info { flex: 1; }
        .title { font-size: 1rem; font-weight: 500; }
        .artist { font-size: 0.85rem; color: #aaa; }

        @media (max-width: 768px) {
           .album-header { flex-direction: column; text-align: center; align-items: center; padding-top: 80px; }
           .album-meta h1 { font-size: 2.5rem; }
           .song-list { padding: 10px; }
        }
      `}</style>
    </div>
  );
}
