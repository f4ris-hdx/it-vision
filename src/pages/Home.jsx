import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';
// FIX: Import from the new Master Database
import { artists, songs } from '../data/db'; 

const ArtistRow = () => {
  const navigate = useNavigate();
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{color:'white', marginBottom:'20px'}}>Popular Artists</h2>
      <div style={{display:'flex', gap:'24px', overflowX:'auto'}}>
        {artists.map((artist) => (
          <div 
             key={artist.name} 
             onClick={() => navigate(`/artist/${artist.name}`)} 
             style={{textAlign:'center', cursor:'pointer', minWidth:'140px'}}
          >
             <img 
                src={artist.image} 
                style={{
                  width:'140px', height:'140px', borderRadius:'50%', objectFit:'cover', 
                  marginBottom:'10px', boxShadow:'0 8px 20px rgba(0,0,0,0.5)'
                }} 
             />
             <h4 style={{color:'white', margin:0}}>{artist.name}</h4>
             <p style={{color:'#aaa', margin:0, fontSize:'0.8rem'}}>Artist</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SongRow = ({ title, data, playTrack }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="song-row">
      <h2>{title}</h2>
      <div className="row-scroll">
        {data.map((song, index) => (
          <div key={`${song.id}-${index}`} className="card" onClick={() => playTrack(song, data)}>
            <div className="image-wrapper">
              <img src={song.image} alt={song.title} />
              {/* FIXED CENTERED PLAY BUTTON */}
              <div className="play-overlay"><i className="fa-solid fa-play"></i></div>
            </div>
            <div className="card-info">
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { playTrack } = usePlayer();

  return (
    <div className="home-container">
      <h1 className="greeting">Good Evening</h1>
      
      {/* 1. Artist Row (From DB) */}
      <ArtistRow />

      {/* 2. Song Rows (With Limits Applied) */}
      {/* FIX: Added .slice(0, 7) to limit items */}
      <SongRow title="Made For You" data={songs.slice(0, 7)} playTrack={playTrack} />
      <SongRow title="New Releases" data={[...songs].reverse().slice(0, 7)} playTrack={playTrack} />

      <style>{`
        .home-container { padding: 24px; padding-bottom: 120px; color: white; }
        .greeting { font-size: 2rem; margin-bottom: 30px; font-weight: 700; }
        h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }
        
        .row-scroll { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .row-scroll::-webkit-scrollbar { display: none; }

        .card { min-width: 180px; width: 180px; background: #181818; padding: 16px; borderRadius: 8px; cursor: pointer; transition: background 0.3s ease; }
        .card:hover { background: #282828; }

        .image-wrapper { position: relative; margin-bottom: 16px; }
        .image-wrapper img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
        
        /* PLAY BUTTON FIXED WITH GRID */
        .play-overlay { 
           position: absolute; bottom: 8px; right: 8px; 
           width: 48px; height: 48px; border-radius: 50%; background: #1db954; 
           display: grid; place-items: center; 
           color: black; font-size: 1.2rem; 
           opacity: 0; transform: translateY(10px); transition: 0.3s ease; 
           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .play-overlay i { transform: translateX(2px); }
        .card:hover .play-overlay { opacity: 1; transform: translateY(0); }

        .card-info h4 { font-size: 1rem; font-weight: 700; margin: 0 0 8px 0; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-info p { font-size: 0.85rem; color: #b3b3b3; margin: 0; }
      `}</style>
    </div>
  );
}
