import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export default function AmbientBackground() {
  const { currentTrack } = usePlayer();

  return (
    <div className="ambient-container">
      {/* 1. If Music is Playing -> Show Album Art Blob */}
      {currentTrack && (
        <div 
          className="ambient-img"
          style={{ backgroundImage: `url(${currentTrack.image})` }}
        ></div>
      )}

      {/* 2. If No Music -> Show Default Aurora */}
      <div className={`aurora-bg ${currentTrack ? 'hidden' : 'visible'}`}></div>

      {/* 3. Dark Overlay (To make text readable) */}
      <div className="ambient-overlay"></div>

      <style>{`
        .ambient-container {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: -1; pointer-events: none; overflow: hidden;
          background: #000;
        }

        /* ALBUM ART MODE */
        .ambient-img {
          position: absolute; top: -20%; left: -20%; width: 140%; height: 140%;
          background-size: cover; background-position: center;
          filter: blur(90px) saturate(1.8) brightness(0.5);
          opacity: 0; 
          animation: fadeInArt 1.5s ease forwards;
        }
        @keyframes fadeInArt { from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }

        /* DEFAULT AURORA MODE */
        .aurora-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(-45deg, #000000, #1a0b2e, #110f24, #0f2027);
          background-size: 400% 400%;
          animation: auroraShift 15s ease infinite;
          transition: opacity 1s ease;
        }
        .aurora-bg.hidden { opacity: 0; }
        .aurora-bg.visible { opacity: 1; }

        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* OVERLAY */
        .ambient-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(18,18,18,0.3) 0%, #121212 100%);
        }
      `}</style>
    </div>
  );
}
