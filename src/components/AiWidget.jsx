import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { songs } from '../data/db'; 

export default function AiWidget() {
  const { playTrack } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // EXPAND MODE
  
  // AI Logic States
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I am your AI DJ. Tell me your mood (e.g., "Gym", "Sad", "Party") and I will build a mix.' }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen, isExpanded]);

  // ---------------------------------------------------------
  // 🔑 CONNECTING TO YOUR .ENV FILE
 
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
  const MODEL_NAME = "gemini-3.1-flash-lite"; 
  // ---------------------------------------------------------

  const generateMix = async () => {
    if (!prompt.trim()) return;
    
    // 1. Check for Key
    if (!GEMINI_API_KEY) {
      setMessages(prev => [...prev, { type: 'bot', text: "❌ Error: API Key missing in .env file." }]);
      return;
    }

    const userMsg = { type: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setPrompt(""); 

    const songMenu = songs.map(s => ({ id: s.id, title: s.title, artist: s.artist }));
    const systemPrompt = `
      You are a Music DJ.
      Library: ${JSON.stringify(songMenu)}.
      Request: "${userMsg.text}"
      Task: Pick as many songs as strictly match the mood.
      Return ONLY a raw JSON array of IDs. Example: [1, 3, 2]
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        // If 404, suggest model change
        if (response.status === 404) throw new Error("Model 404: Try 'gemini-1.5-flash' or 'gemini-2.0-flash-exp'");
        throw new Error(data.error?.message || "Connection Failed");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("AI returned empty.");

      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const songIds = JSON.parse(cleanText);
      const matchedSongs = songIds.map(id => songs.find(s => s.id === id)).filter(Boolean);

      if (matchedSongs.length === 0) throw new Error("No matching songs.");

      setMessages(prev => [
        ...prev, 
        { type: 'bot', text: `Here is a ${userMsg.text} mix with ${matchedSongs.length} tracks.`, playlist: matchedSongs }
      ]);

    } catch (err) {
      console.error("AI Error:", err);
      // Fallback to random if API fails
      const randomSongs = [...songs].sort(() => 0.5 - Math.random()).slice(0, 3);
      setMessages(prev => [
        ...prev, 
        { type: 'bot', text: `Connection issue (${err.message}). Here is a random mix instead!`, playlist: randomSongs }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`ai-fab ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-wand-magic-sparkles"></i>
      </div>

      <div className={`ai-window ${isOpen ? 'open' : ''} ${isExpanded ? 'maximized' : ''}`}>
        <div className="ai-header">
          <div className="ai-title"><i className="fa-solid fa-robot"></i> AI DJ</div>
          <div className="header-actions">
            <button onClick={() => setIsExpanded(!isExpanded)} className="icon-btn">
              <i className={`fa-solid ${isExpanded ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
            <button onClick={() => setIsOpen(false)} className="icon-btn">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="ai-body">
          {messages.map((msg, i) => (
            <div key={i} className="msg-container">
              <div className={`msg ${msg.type}`}>{msg.text}</div>
              {msg.playlist && (
                <div className="result-card">
                  <div className="rc-header">
                    <span>Generated Mix</span>
                    <button className="play-all-btn" onClick={() => playTrack(msg.playlist[0], msg.playlist)}>
                      <i className="fa-solid fa-play"></i> Play All
                    </button>
                  </div>
                  <div className="rc-list">
                    {msg.playlist.map((song, idx) => (
                      <div key={idx} className="rc-row" onClick={() => playTrack(song, msg.playlist)}>
                        <img src={song.image} alt="" />
                        <div className="rc-info">
                          <div className="rc-title">{song.title}</div>
                          <div className="rc-artist">{song.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && <div className="msg bot"><i className="fa-solid fa-circle-notch fa-spin"></i> Thinking...</div>}
          <div ref={messagesEndRef} style={{ height: '10px' }} />
        </div>

        <div className="ai-footer">
          <input 
            type="text" placeholder="Type a mood..." value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateMix()}
          />
          <button onClick={generateMix}><i className="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>

      <style>{`
        .ai-fab { position: fixed; bottom: 100px; right: 30px; width: 60px; height: 60px; background: linear-gradient(135deg, #00C6FF, #0072FF); border-radius: 50%; display: grid; place-items: center; font-size: 1.5rem; color: white; box-shadow: 0 4px 20px rgba(0, 114, 255, 0.4); cursor: pointer; z-index: 5000; transition: 0.3s; }
        .ai-fab:hover { transform: scale(1.1); }
        .ai-fab.hidden { transform: scale(0); opacity: 0; pointer-events: none; }

        .ai-window { position: fixed; bottom: 100px; right: 30px; width: 380px; height: 550px; background: #121212; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.8); display: flex; flex-direction: column; z-index: 5001; transform: scale(0); opacity: 0; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid #333; overflow: hidden; transform-origin: bottom right; }
        .ai-window.open { transform: scale(1); opacity: 1; }
        .ai-window.maximized { width: 90vw; height: 80vh; bottom: 50%; right: 50%; transform: translate(50%, 50%) scale(1) !important; transform-origin: center center; }

        .ai-header { padding: 15px; background: linear-gradient(135deg, #00C6FF, #0072FF); color: white; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
        .header-actions { display: flex; gap: 10px; }
        .icon-btn { background: rgba(0,0,0,0.2); border: none; color: white; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; transition: 0.2s; }
        .icon-btn:hover { background: rgba(0,0,0,0.4); }

        .ai-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #121212; }
        .msg { padding: 12px 16px; border-radius: 12px; font-size: 0.95rem; max-width: 85%; line-height: 1.5; word-wrap: break-word; }
        .msg.bot { background: #2a2a2a; color: #ddd; align-self: flex-start; border-bottom-left-radius: 2px; }
        .msg.user { background: #0072FF; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }

        .result-card { background: #181818; border: 1px solid #333; border-radius: 8px; overflow: hidden; width: 100%; margin-top: 5px; }
        .rc-header { background: #222; padding: 10px 15px; font-size: 0.8rem; color: #aaa; font-weight: bold; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; }
        .play-all-btn { background: #1db954; color: black; border: none; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; cursor: pointer; }
        .rc-list { max-height: 250px; overflow-y: auto; }
        .ai-window.maximized .rc-list { max-height: 500px; }
        .rc-row { display: flex; gap: 12px; padding: 12px; align-items: center; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #222; }
        .rc-row:hover { background: #333; }
        .rc-row img { width: 45px; height: 45px; border-radius: 4px; object-fit: cover; }
        .rc-info { flex: 1; overflow: hidden; }
        .rc-title { color: white; font-size: 0.95rem; font-weight: 600; }
        .rc-artist { color: #aaa; font-size: 0.85rem; }

        .ai-footer { padding: 15px; background: #1e1e1e; border-top: 1px solid #333; display: flex; gap: 10px; }
        .ai-footer input { flex: 1; padding: 12px; border-radius: 25px; border: none; background: #333; color: white; outline: none; }
        .ai-footer button { width: 45px; height: 45px; border-radius: 50%; border: none; background: #0072FF; color: white; cursor: pointer; }
      `}</style>
    </>
  );
}
