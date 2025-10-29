import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  audioUrl?: string;
  title: string;
  speechUtterance?: SpeechSynthesisUtterance | null;
  onSpeechEnd?: () => void;
}

const AudioPlayer = ({ audioUrl, title, speechUtterance, onSpeechEnd }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const speechProgressInterval = useRef<number>();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle speech synthesis
  useEffect(() => {
    if (speechUtterance) {
      setIsSpeechMode(true);
      setCurrentTime(0);
      setIsPlaying(false);
      
      const estimatedDuration = (speechUtterance.text.length / 10) * 1000;
      setDuration(estimatedDuration / 1000);
      
      const handleEnd = () => {
        setIsPlaying(false);
        if (speechProgressInterval.current) {
          clearInterval(speechProgressInterval.current);
        }
        onSpeechEnd?.();
      };

      speechUtterance.onend = handleEnd;
      speechUtterance.onerror = handleEnd;

      return () => {
        if (speechProgressInterval.current) {
          clearInterval(speechProgressInterval.current);
        }
      };
    } else {
      setIsSpeechMode(false);
    }
  }, [speechUtterance, onSpeechEnd]);

  const togglePlay = () => {
    if (isSpeechMode && speechUtterance) {
      if (isPlaying) {
        // Pause speech
        window.speechSynthesis.pause();
        setIsPlaying(false);
        if (speechProgressInterval.current) {
          clearInterval(speechProgressInterval.current);
        }
      } else {
        // Check if we can resume or need to start fresh
        if (window.speechSynthesis.paused && currentTime > 0 && currentTime < duration) {
          // Resume paused speech
          window.speechSynthesis.resume();
        } else {
          // Start new speech
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
          }
          
          setTimeout(() => {
            setCurrentTime(0);
            window.speechSynthesis.speak(speechUtterance);
          }, 100);
        }
        setIsPlaying(true);
        
        // Update progress during speech
        if (speechProgressInterval.current) {
          clearInterval(speechProgressInterval.current);
        }
        speechProgressInterval.current = window.setInterval(() => {
          setCurrentTime(prev => {
            const next = prev + 0.1;
            return next >= duration ? duration : next;
          });
        }, 100);
      }
    } else {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSpeechMode) {
      // Speech synthesis doesn't support seeking
      return;
    }
    
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioUrl && !speechUtterance) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50"
    >
      <div className="container mx-auto px-4 py-3">
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {isSpeechMode && (
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative h-1 rounded-full bg-muted">
                  <div 
                    className="absolute h-full bg-primary rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                  {!isSpeechMode && (
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
