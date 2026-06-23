import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active-nav' : '';

  return (
    <aside className="sidebar">
      <div className="brand">
        <i className="fa-solid fa-music" style={{fontSize:'2rem', color:'#bbff00'}}></i> 
         <Link to="/" className={`nav-item ${isActive('/')}`}>
        <h1>Musify</h1>
  </Link>
      </div>
      
      <nav>
        <Link to="/" className={`nav-item ${isActive('/')}`}>
            <i className="fa-solid fa-house"></i> Home
        </Link>
        <Link to="/search" className={`nav-item ${isActive('/search')}`}>
            <i className="fa-solid fa-magnifying-glass"></i> Search
        </Link>
        <Link to="/library" className={`nav-item ${isActive('/library')}`}>
            <i className="fa-solid fa-book-open"></i> Library
        </Link>
      </nav>

      <style>{`
        .sidebar { width: 240px; background: #030303; padding: 24px; display: flex; flex-direction: column; gap: 30px; }
        .brand { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; letter-spacing: -1px; }
        
        .nav-item { 
          color: #aaa; text-decoration: none; font-size: 1rem; font-weight: 500; 
          display: flex; align-items: center; gap: 20px; padding: 12px 0; transition: 0.2s; 
        }
        .nav-item:hover, .nav-item.active-nav { color: white; }
        .nav-item i { width: 24px; text-align: center; font-size: 1.2rem; }
        .nav-item.active-nav i { color: white; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
}
