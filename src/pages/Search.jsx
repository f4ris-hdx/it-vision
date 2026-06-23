import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
// IMPORT ALL DATA
import { songs, artists, albums, playlists } from '../data/db'; 
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const { playTrack } = usePlayer();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // --- FILTER LOGIC ---
  const q = query.toLowerCase();
  
  const artistResults = artists.filter(a => a.name.toLowerCase().includes(q));
  
  const albumResults = albums.filter(a => 
    a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
  );
  
  const playlistResults = playlists.filter(p => 
    p.title.toLowerCase().includes(q)
  );

  const songResults = songs.filter(s => 
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );

  return (
    <div style={{ padding: '24px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Search Input */}
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '20px', top: '18px', color: '#121212', fontSize: '1.2rem' }}></i>
        <input 
          type="text" 
          placeholder="Search for artists, songs, or albums..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{ width: '100%', padding: '15px 15px 15px 55px', borderRadius: '50px', border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: '500' }}
        />
      </div>

      {/* 1. ARTISTS SECTION */}
      {query && artistResults.length > 0 && (
        <div className="section">
           <h2>Artists</h2>
           <div className="flex-row">
              {artistResults.map(artist => (
                 <div key={artist.name} onClick={() => navigate(`/artist/${artist.name}`)} className="artist-card">
                    <img src={artist.image} alt={artist.name} />
                    <h4>{artist.name}</h4>
                    <p>Artist</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* 2. ALBUMS SECTION */}
      {query && albumResults.length > 0 && (
        <div className="section">
           <h2>Albums</h2>
           <div className="flex-row">
              {albumResults.map(album => (
                 <div key={album.title} onClick={() => navigate(`/album/${album.title}`)} className="standard-card">
                    <img src={album.image} alt={album.title} />
                    <h4>{album.title}</h4>
                    <p>Album • {album.artist}</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* 3. PLAYLISTS SECTION */}
      {query && playlistResults.length > 0 && (
        <div className="section">
           <h2>Playlists</h2>
           <div className="flex-row">
              {playlistResults.map(pl => (
                 <div key={pl.id} onClick={() => navigate(`/playlist/${pl.id}`)} className="standard-card">
                    <img src={pl.image} alt={pl.title} />
                    <h4>{pl.title}</h4>
                    <p>Playlist</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* 4. SONGS SECTION */}
      <div className="section">
        <h2>{query ? "Songs" : "Browse All Songs"}</h2>
        {songResults.length === 0 ? <p style={{color:'#aaa'}}>No songs found.</p> : (
          <div className="grid-layout">
            {songResults.map((song) => (
              <div key={song.id} className="song-card" onClick={() => playTrack(song, songResults)}>
                <div className="img-wrap">
                  <img src={song.image} alt={song.title} />
                  <div className="play-overlay"><i className="fa-solid fa-play"></i></div>
                </div>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .section { marginBottom: 40px; }
        h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }
        
        .flex-row { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 10px; }
        .flex-row::-webkit-scrollbar { display: none; }

        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 24px; }

        /* ARTIST CARD (Circle) */
        .artist-card { text-align: center; cursor: pointer; background: #181818; padding: 20px; border-radius: 8px; min-width: 180px; transition: 0.2s; }
        .artist-card:hover { background: #282828; }
        .artist-card img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        
        /* STANDARD CARD (Square - Album/Playlist) */
        .standard-card { cursor: pointer; background: #181818; padding: 16px; border-radius: 8px; min-width: 180px; transition: 0.2s; }
        .standard-card:hover { background: #282828; }
        .standard-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 4px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }

        /* SONG CARD */
        .song-card { background: #181818; padding: 16px; border-radius: 8px; cursor: pointer; transition: 0.3s ease; }
        .song-card:hover { background: #282828; }
        .img-wrap { position: relative; margin-bottom: 12px; }
        .img-wrap img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        
        .play-overlay { position: absolute; bottom: 8px; right: 8px; width: 48px; height: 48px; border-radius: 50%; background: #1db954; display: grid; place-items: center; color: black; font-size: 1.2rem; opacity: 0; transform: translateY(10px); transition: 0.3s ease; }
        .play-overlay i { transform: translateX(2px); }
        .song-card:hover .play-overlay { opacity: 1; transform: translateY(0); }

        h4 { margin: 0 0 5px 0; font-size: 1rem; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        p { margin: 0; font-size: 0.85rem; color: #b3b3b3; }
      `}</style>
    </div>
  );
}
