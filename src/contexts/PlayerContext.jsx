import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]); // Backup for un-shuffling
  
  // 0 = No Repeat, 1 = Repeat All, 2 = Repeat One
  const [repeatMode, setRepeatMode] = useState(0); 
  const [isShuffle, setIsShuffle] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- AUDIO EVENT LISTENERS ---
  useEffect(() => {
    const audio = audioRef.current;
    
    // Updates the progress bar
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    // DECIDES WHAT HAPPENS WHEN SONG ENDS
    const handleEnded = () => {
      if (repeatMode === 2) { 
        // Mode 2: Repeat One -> Just replay current
        audio.currentTime = 0;
        audio.play();
      } else {
        // Mode 0 or 1: Try to play next
        playNext(true); 
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, repeatMode, currentTrack]); 

  // --- CORE FUNCTIONS ---

  const playTrack = (track, newQueue) => {
    // If a new list of songs is provided (e.g. clicked an Album)
    if (newQueue) {
      setOriginalQueue(newQueue); 
      // If shuffle is ON, randomize immediately
      if (isShuffle) {
        const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
      } else {
        setQueue(newQueue);
      }
    }
    
    setCurrentTrack(track);
    // Support both 'url' (online) and 'audio' (local) properties
    audioRef.current.src = track.url || track.audio; 
    audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = (isAuto = false) => {
    if (!queue.length) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentTrack?.id);
    let nextIndex = currentIndex + 1;

    // IF WE REACH THE END
    if (nextIndex >= queue.length) {
      if (repeatMode === 1) {
        nextIndex = 0; // Loop back to start
      } else if (isAuto && repeatMode === 0) {
        setIsPlaying(false); // Stop if no repeat
        return; 
      } else {
        nextIndex = 0; // Manual click wraps around
      }
    }
    
    playTrack(queue[nextIndex]);
  };

  const playPrevious = () => {
    // If song played for > 3 seconds, restart it
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = queue.findIndex(s => s.id === currentTrack?.id);
    // Wrap around to last song if at start
    const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;
    playTrack(queue[prevIndex]);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleShuffle = () => {
    const newStatus = !isShuffle;
    setIsShuffle(newStatus);
    
    if (newStatus) {
      // Shuffle: Randomize
      setQueue(prev => [...prev].sort(() => Math.random() - 0.5));
    } else {
      // Un-Shuffle: Restore original order
      setQueue(originalQueue);
    }
  };

  const toggleRepeat = () => {
    // Cycle: 0 -> 1 -> 2 -> 0
    setRepeatMode(prev => (prev + 1) % 3);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, queue, 
      playTrack, togglePlay, playNext, playPrevious, seek,
      currentTime, duration,
      isShuffle, toggleShuffle,
      repeatMode, toggleRepeat
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
