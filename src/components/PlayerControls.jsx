import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export default function PlayerControls() {
  const { 
    currentTrack, isPlaying, togglePlay, playNext, playPrevious, queue, playTrack,
    currentTime, duration, seek, isShuffle, toggleShuffle, repeatMode, toggleRepeat
  } = usePlayer();
  
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <>
      {/* --- MINI PLAYER --- */}
      <div 
        className="mini-player" 
        onClick={() => setIsExpanded(true)}
        style={{ opacity: isExpanded ? 0 : 1, pointerEvents: isExpanded ? 'none' : 'auto' }}
      >
        <div className="mp-left">
          <img src={currentTrack.image} alt="" className="mp-img spin-art" style={{animationPlayState: isPlaying ? 'running' : 'paused'}} />
          <div className="mp-text">
             <div className="mp-title">{currentTrack.title}</div>
             <div className="mp-artist">{currentTrack.artist}</div>
          </div>
        </div>
        <div className="mp-controls" onClick={(e) => e.stopPropagation()}>
           <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} onClick={togglePlay}></i>
           <i className="fa-solid fa-forward-step next-btn" onClick={() => playNext()}></i>
        </div>
        <div className="mp-prog">
           <div className="mp-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>
      </div>

      {/* --- FULL SCREEN PLAYER --- */}
      <div className={`player-expanded ${isExpanded ? 'open' : ''}`}>
        
        <div className="exp-header">
          <i className="fa-solid fa-chevron-down" onClick={() => setIsExpanded(false)}></i>
          <span className="header-title">NOW PLAYING</span>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>

        <div className="exp-body">
          <div className="exp-left">
            <div className="exp-art-box">
               <img src={currentTrack.image} alt="" className={isPlaying ? 'breathing' : ''} />
            </div>

            <div className="exp-info">
               <div>
                 <h2 className="exp-title">{currentTrack.title}</h2>
                 <p className="exp-artist">{currentTrack.artist}</p>
               </div>
               <i className="fa-regular fa-heart like-btn"></i>
            </div>

            <div className="exp-progress">
               <input 
                 type="range" 
                 min="0" max={duration || 0} 
                 value={currentTime} 
                 onChange={(e) => seek(Number(e.target.value))}
                 className="progress-slider"
               />
               <div className="times">
                 <span>{formatTime(currentTime)}</span>
                 <span>{formatTime(duration)}</span>
               </div>
            </div>

            <div className="exp-controls">
               <i className="fa-solid fa-shuffle" onClick={toggleShuffle} style={{ color: isShuffle ? '#1db954' : '#aaa', cursor: 'pointer' }}></i>
               <i className="fa-solid fa-backward-step big" onClick={playPrevious}></i>
               <div className="play-circle" onClick={togglePlay}>
                  <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
               </div>
               <i className="fa-solid fa-forward-step big" onClick={() => playNext()}></i>
               <div onClick={toggleRepeat} style={{ cursor: 'pointer', position: 'relative', width:'24px', display:'grid', placeItems:'center' }}>
                  {repeatMode === 0 && <i className="fa-solid fa-repeat" style={{color: '#aaa'}}></i>}
                  {repeatMode === 1 && <i className="fa-solid fa-repeat" style={{color: '#1db954'}}></i>}
                  {repeatMode === 2 && (<><i className="fa-solid fa-repeat" style={{color: '#1db954'}}></i><span style={{position:'absolute', top:'-8px', right:'-8px', fontSize:'0.6rem', background:'#1db954', color:'black', borderRadius:'50%', width:'14px', height:'14px', display:'grid', placeItems:'center', fontWeight:'bold'}}>1</span></>)}
               </div>
            </div>
          </div>

          <div className="exp-right">
             <h3 className="q-head">UP NEXT</h3>
             {queue.map((song, i) => (
                <div key={i} className="eq-item" onClick={() => playTrack(song, queue)} style={{ background: currentTrack.id === song.id ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                   <img src={song.image} alt=""/>
                   <div><div className="eq-title">{song.title}</div><div className="eq-artist">{song.artist}</div></div>
                   {currentTrack.id === song.id && <i className="fa-solid fa-chart-simple" style={{marginLeft:'auto', color:'#1db954'}}></i>}
                </div>
             ))}
          </div>
        </div>
      </div>

      <style>{`
        /* MINI PLAYER GLASS */
        .mini-player { 
          position: fixed; bottom: 60px; left: 0; width: 100%; height: 65px; 
          background: rgba(33, 33, 33, 0.95); /* Semi-transparent */
          backdrop-filter: blur(10px);
          border-top: 1px solid #333; z-index: 4000; 
          display: flex; align-items: center; justify-content: space-between; padding: 0 16px; 
          cursor: pointer; transition: opacity 0.3s ease; 
        }
        @media (min-width: 900px) { .mini-player { bottom: 0; height: 80px; } }
        
        /* EXPANDED PLAYER GLASS (Transparent for Ambient BG) */
        .player-expanded { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
          background: rgba(0, 0, 0, 0.85); /* See-through black */
          backdrop-filter: blur(20px); /* Heavy blur for readability */
          z-index: 9999; display: flex; flex-direction: column; color: white; 
          transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); 
        }
        .player-expanded.open { transform: translateY(0); }

        /* ... REST OF CSS (Keeping your original layout) ... */
        .mp-left { display: flex; gap: 12px; align-items: center; }
        .mp-img { width: 48px; height: 48px; border-radius: 4px; object-fit: cover; }
        .mp-text { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mp-title { font-size: 0.9rem; font-weight: 500; color: white; }
        .mp-artist { font-size: 0.8rem; color: #aaa; }
        .mp-controls { display: flex; gap: 20px; font-size: 1.5rem; align-items: center; color: white; }
        .next-btn { display: block; }
        @media (max-width: 400px) { .next-btn { display: none; } }
        .mp-prog { position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #444; }
        .mp-fill { height: 100%; background: white; transition: width 0.1s linear; }

        .exp-header { padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .header-title { font-size: 0.8rem; letter-spacing: 1px; color: #aaa; }
        .exp-body { flex: 1; display: flex; overflow: hidden; padding: 0 30px 30px 30px; gap: 50px; }
        .exp-left { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 600px; margin: 0 auto; width: 100%; }
        .exp-right { width: 400px; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 30px; overflow-y: auto; display: none; }
        
        .exp-art-box { width: 100%; display: flex; justify-content: center; margin-bottom: 30px; }
        .exp-art-box img { width: 100%; max-width: 350px; aspect-ratio: 1/1; border-radius: 8px; object-fit: cover; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .breathing { animation: breathe 4s infinite ease-in-out; }
        @keyframes breathe { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }

        .exp-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .exp-title { font-size: 1.8rem; font-weight: 700; margin: 0; }
        .exp-artist { color: #aaa; font-size: 1.1rem; margin: 5px 0 0 0; }
        .like-btn { font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .like-btn:active { transform: scale(1.3); color: #1db954; }

        .progress-slider { width: 100%; accent-color: white; height: 4px; cursor: pointer; }
        .times { display: flex; justify-content: space-between; color: #aaa; margin-top: 10px; font-size: 0.8rem; }
        .exp-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; font-size: 1.5rem; }
        .big { font-size: 2.2rem; cursor: pointer; transition: 0.2s; }
        .big:hover { color: white; transform: scale(1.1); }
        .play-circle { width: 70px; height: 70px; background: white; color: black; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2rem; cursor: pointer; transition: transform 0.2s; }
        .play-circle:active { transform: scale(0.9); }
        
        .q-head { color: #aaa; font-size: 0.9rem; margin-bottom: 20px; }
        .eq-item { display: flex; gap: 15px; align-items: center; margin-bottom: 10px; padding: 10px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
        .eq-item:hover { background: rgba(255,255,255,0.1); }
        .eq-item img { width: 50px; height: 50px; border-radius: 4px; }
        .eq-title { font-weight: 500; font-size: 0.95rem; }
        .eq-artist { font-size: 0.8rem; color: #aaa; }

        @media (max-width: 900px) {
          .exp-body { flex-direction: column; overflow-y: auto; display: block; } 
          .exp-left { margin-bottom: 50px; } 
          .exp-right { display: block; width: 100%; border-left: none; padding-left: 0; border-top: 1px solid #333; padding-top: 30px; padding-bottom: 100px; }
        }
        @media (min-width: 901px) { .exp-right { display: block; } }
      `}</style>
    </>
  );
}
