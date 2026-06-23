import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import { artists, albums, playlists, songs } from '../data/db'; 

export default function ArtistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, currentTrack } = usePlayer();
  
  const [artist, setArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistPlaylists, setArtistPlaylists] = useState([]);

  useEffect(() => {
    const cleanName = decodeURIComponent(id || "");
    const foundArtist = artists.find(a => a.name.toLowerCase() === cleanName.toLowerCase());
    
    if (foundArtist) {
      const foundSongs = songs.filter(s => s.artist.toLowerCase().includes(cleanName.toLowerCase()));
      const foundAlbums = albums.filter(a => a.artist.toLowerCase().includes(cleanName.toLowerCase()));
      
      // Filter playlists that actually contain artist's songs
      const artistSongIds = foundSongs.map(s => s.id);
      const foundPlaylists = playlists.filter(pl => pl.songIds.some(sid => artistSongIds.includes(sid)));

      setArtist(foundArtist);
      setArtistSongs(foundSongs);
      setArtistAlbums(foundAlbums);
      setArtistPlaylists(foundPlaylists);
    }
  }, [id]);

  if (!artist) return <div style={{padding:'50px', color:'white'}}>Artist Not Found</div>;

  return (
    <div className="artist-page">
      
      {/* --- BACK BUTTON --- */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      {/* HEADER */}
      <div className="artist-header" style={{ backgroundImage: `url(${artist.header || artist.image})` }}>
        <div className="header-overlay">
          <div className="verified"><i className="fa-solid fa-certificate"></i> Verified Artist</div>
          <h1 className="artist-name">{artist.name}</h1>
          <p className="listeners">{artist.listeners} monthly listeners</p>
        </div>
      </div>

      <div className="action-bar">
        <div className="play-fab" onClick={() => artistSongs.length > 0 && playTrack(artistSongs[0], artistSongs)}>
          <i className="fa-solid fa-play"></i>
        </div>
        <button className="follow-btn">FOLLOW</button>
      </div>

      <div className="section">
        <h3>Popular</h3>
        <div className="song-list">
          {artistSongs.slice(0, 5).map((song, i) => (
            <div key={song.id} className="song-row" onClick={() => playTrack(song, artistSongs)}>
              <span className="song-index">{currentTrack?.id === song.id ? <i className="fa-solid fa-chart-simple" style={{color:'#1db954'}}></i> : i+1}</span>
              <img src={song.image} className="song-img" alt=""/>
              <div className="song-info">
                <div className="song-title" style={{color: currentTrack?.id === song.id ? '#1db954' : 'white'}}>{song.title}</div>
                <div className="song-views">124M</div>
              </div>
            </div>
          ))}
          {artistSongs.length === 0 && <p style={{color:'#aaa'}}>No songs found.</p>}
        </div>
      </div>

      {/* DISCOGRAPHY */}
      <div className="section">
        <h3>Discography</h3>
        <div className="card-row">
          {artistAlbums.map(album => (
            <div key={album.title} className="card" onClick={() => navigate(`/album/${album.title}`)}>
               <img src={album.image} alt={album.title} />
               <h4>{album.title}</h4>
               <p>{album.year} • Album</p>
            </div>
          ))}
          {artistAlbums.length === 0 && <p style={{color:'#aaa'}}>No albums found.</p>}
        </div>
      </div>

      {/* PLAYLISTS */}
      {artistPlaylists.length > 0 && (
        <div className="section">
          <h3>Appears On</h3>
          <div className="card-row">
            {artistPlaylists.map(pl => (
              <div key={pl.id} className="card" onClick={() => navigate(`/playlist/${pl.id}`)}>
                 <img src={pl.image} alt={pl.title} />
                 <h4>{pl.title}</h4>
                 <p>Playlist</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .artist-page { color: white; padding-bottom: 120px; position: relative; }
        
        /* BACK BUTTON STYLE */
        .back-btn { 
          position: absolute; top: 20px; left: 20px; 
          width: 40px; height: 40px; border-radius: 50%; 
          background: rgba(0,0,0,0.7); display: grid; place-items: center; 
          cursor: pointer; z-index: 100; transition: 0.2s;
        }
        .back-btn:hover { background: #000; transform: scale(1.1); }
        .back-btn i { font-size: 1.2rem; color: white; }

        .artist-header { height: 40vh; background-size: cover; background-position: center 20%; }
        .header-overlay { width: 100%; height: 100%; background: linear-gradient(transparent, rgba(0,0,0,0.8)); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; }
        
        .verified { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; margin-bottom: 10px; }
        .verified i { color: #3d91f4; background: white; border-radius: 50%; }
        .artist-name { font-size: 5rem; font-weight: 900; margin: 0; line-height: 1; text-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .listeners { margin-top: 10px; font-weight: 500; }

        .action-bar { padding: 24px 30px; display: flex; gap: 30px; align-items: center; }
        .play-fab { width: 56px; height: 56px; background: #1db954; border-radius: 50%; display: grid; place-items: center; color: black; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .play-fab:hover { transform: scale(1.05); }
        .play-fab i { transform: translateX(2px); }
        .follow-btn { background: transparent; border: 1px solid #777; color: white; padding: 7px 25px; border-radius: 50px; font-weight: 700; cursor: pointer; }

        .section { padding: 0 30px; margin-bottom: 40px; }
        .section h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }

        .song-row { display: flex; align-items: center; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
        .song-row:hover { background: rgba(255,255,255,0.1); }
        .song-index { width: 30px; color: #aaa; text-align: center; }
        .song-img { width: 40px; height: 40px; margin: 0 20px; border-radius: 2px; }
        .song-info { flex: 1; }
        .song-title { font-size: 1rem; font-weight: 500; }
        .song-views { color: #aaa; font-size: 0.85rem; }

        .card-row { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .card-row::-webkit-scrollbar { display: none; }
        .card { min-width: 180px; width: 180px; background: #181818; padding: 16px; border-radius: 8px; cursor: pointer; transition: background 0.3s; }
        .card:hover { background: #282828; }
        .card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 4px; margin-bottom: 15px; }
        .card h4 { font-size: 1rem; font-weight: 700; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card p { font-size: 0.85rem; color: #aaa; margin: 0; }

        @media (max-width: 768px) { .artist-name { font-size: 3rem; } }
      `}</style>
    </div>
  );
}
