import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';

// COMPONENTS
import Sidebar from './components/Sidebar';
import PlayerControls from './components/PlayerControls';

// --- NEW IMPORTS (The only things we are adding) ---
import AmbientBackground from './components/AmbientBackground';
import AiWidget from './components/AiWidget';

// PAGES
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import AiGenerator from './components/AiWidget'; 
import ArtistDetails from './pages/ArtistDetails';
import AlbumDetails from './pages/AlbumDetails';       
import PlaylistDetails from './pages/PlaylistDetails'; 

// --- 1. RIGHT QUEUE (Desktop) ---
const RightQueue = () => {
  const { queue, playTrack, currentTrack } = usePlayer();
  if (!queue || queue.length === 0) return null;
  return (
    <aside className="right-queue">
      <h3>Up Next</h3>
      {queue.map((song, i) => (
        <div key={i} className="queue-item" onClick={() => playTrack(song, queue)} style={{ opacity: currentTrack?.id === song.id ? 1 : 0.6 }}>
          <img src={song.image} alt="" />
          <div><div className="title">{song.title}</div><div className="artist">{song.artist}</div></div>
        </div>
      ))}
    </aside>
  );
};

// --- 2. MOBILE NAVIGATION (Restored) ---
const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="mobile-nav">
      <Link to="/" className={`nav-link ${isActive('/')}`}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>
      <Link to="/search" className={`nav-link ${isActive('/search')}`}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </Link>
      <Link to="/library" className={`nav-link ${isActive('/library')}`}>
        <i className="fa-solid fa-book-open"></i>
        <span>Library</span>
      </Link>
    </nav>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-layout">
        {/* --- ADDITION 1: The Ambient Background --- */}
        <AmbientBackground />

        <Sidebar />
        
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/ai" element={<AiGenerator />} />
            <Route path="/artist/:id" element={<ArtistDetails />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/playlist/:id" element={<PlaylistDetails />} />
          </Routes>
        </main>

        <RightQueue />
        
        {/* --- ADDITION 2: The Floating AI Widget --- */}
        <AiWidget />
        
        {/* PLAYER & MOBILE NAV */}
        <PlayerControls />
        <MobileNav />

        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; background: #000; color: white; font-family: sans-serif; overflow: hidden; }
          .app-layout { display: flex; height: 100vh; width: 100vw; position: relative; } /* Added relative position */
          .content { flex: 1; background: transparent; overflow-y: auto; padding-bottom: 150px; z-index: 5; } /* Made transparent for bg */

          /* RIGHT QUEUE */
          .right-queue { width: 320px; background: rgba(0,0,0,0.5); padding: 20px; border-left: 1px solid #1a1a1a; display: none; overflow-y: auto; z-index: 5; backdrop-filter: blur(10px); }
          .queue-item { display: flex; gap: 12px; align-items: center; margin-bottom: 10px; padding: 8px; cursor: pointer; }
          .queue-item:hover { background: #1a1a1a; }
          .queue-item img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
          .queue-item .title { font-size: 0.9rem; font-weight: 500; }
          .queue-item .artist { font-size: 0.8rem; color: #aaa; }

          /* MOBILE NAV */
          .mobile-nav { display: none; }

          /* RESPONSIVE RULES */
          @media (min-width: 1000px) { 
            .right-queue { display: block; } 
          }
          
          @media (max-width: 900px) { 
            .right-queue { display: none; } 
            
            /* SHOW MOBILE NAV */
            .mobile-nav {
              position: fixed; bottom: 0; left: 0; width: 100%; height: 60px;
              background: #000; border-top: 1px solid #222;
              display: flex; justify-content: space-around; align-items: center;
              z-index: 5000; /* Highest layer */
            }
            .nav-link {
              display: flex; flex-direction: column; align-items: center; gap: 5px;
              color: #777; text-decoration: none; font-size: 0.7rem;
            }
            .nav-link i { font-size: 1.2rem; }
            .nav-link.active { color: white; }
          }
        `}</style>
      </div>
    </PlayerProvider>
  );
}
