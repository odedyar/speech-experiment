import React, { useRef, useState } from 'react';

interface AudioPlayerProps {
  audioBlob: Blob;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`audio-player ${className}`}>
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
      />
      
      <button 
        onClick={isPlaying ? handlePause : handlePlay}
        className="play-pause-button"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  );
};

export default AudioPlayer;
