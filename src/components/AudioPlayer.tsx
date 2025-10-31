import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  audioUrl?: string;
  title: string;
  speechUtterance?: SpeechSynthesisUtterance | null;
  onSpeechEnd?: () => void;
}

// This interface is needed to access the Android bridge
declare global {
  interface Window {
    Android?: {
      speak: (text: string) => void;
      stop: () => void;
    };
    androidBridgeReady?: () => void;
  }
}

const AudioPlayer = ({ audioUrl, title, speechUtterance, onSpeechEnd }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- NEW: State to track if the native Android bridge is ready ---
  const [isAndroidReady, setIsAndroidReady] = useState(false);
  const speechProgressInterval = useRef<number>();

  // --- NEW: Listen for the signal from the Android app ---
  useEffect(() => {
    // This function will be called by the Android app's onPageFinished
    window.androidBridgeReady = () => {
      console.log("Android bridge is now ready!");
      setIsAndroidReady(true);
    };

    // Cleanup
    return () => {
      window.androidBridgeReady = undefined;
    };
  }, []);

  // Effect for handling regular MP3 audio files
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || speechUtterance) return; // Only for MP3 mode

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
  }, [speechUtterance]);

  // --- UPDATED: Main effect to handle speech synthesis ---
  useEffect(() => {
    if (!speechUtterance) return;

    // A function to clean up any running timers or speech
    const cleanup = () => {
      if (speechProgressInterval.current) {
        clearInterval(speechProgressInterval.current);
      }
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // 1. Prioritize Native Android TTS
    if (isAndroidReady && window.Android) {
      console.log("Using Native Android TTS");
      cleanup(); // Clean up previous state

      const estimatedDuration = (speechUtterance.text.length / 10) * 1.1; // Estimate duration (s)
      setDuration(estimatedDuration);

      window.Android.speak(speechUtterance.text);
      setIsPlaying(true);

      // --- RESTORED: Visual timer for native TTS ---
      speechProgressInterval.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= estimatedDuration) {
            clearInterval(speechProgressInterval.current);
            setIsPlaying(false); // Stop when timer ends
            onSpeechEnd?.();
            return estimatedDuration;
          }
          return prev + 0.1;
        });
      }, 100);

      return () => {
        cleanup();
        window.Android?.stop();
      };
    }
    // 2. Fallback to Web Browser TTS
    else if (window.speechSynthesis) {
      console.log("Using Web Browser TTS");
      cleanup();

      const handleEnd = () => {
        cleanup();
        onSpeechEnd?.();
      };

      const handleError = (event: SpeechSynthesisErrorEvent) => {
        console.error('Web Speech error:', event.error);
        cleanup();
        onSpeechEnd?.();
      };
      
      speechUtterance.onend = handleEnd;
      speechUtterance.onerror = handleError;
      
      window.speechSynthesis.speak(speechUtterance);
      setIsPlaying(true);

      // --- RESTORED: Visual timer for web TTS ---
       const estimatedDuration = (speechUtterance.text.length / 10) * 1.1;
       setDuration(estimatedDuration);
       speechProgressInterval.current = window.setInterval(() => {
        setCurrentTime(prev => {
           if(prev >= estimatedDuration) {
              clearInterval(speechProgressInterval.current);
              return estimatedDuration;
           }
           return prev + 0.1;
        });
       }, 100);

      return () => {
        cleanup();
        window.speechSynthesis.cancel();
      };
    }

  }, [speechUtterance, onSpeechEnd, isAndroidReady]);

  const togglePlay = () => {
    // Logic for Speech Mode
    if (speechUtterance) {
      if (isAndroidReady && window.Android) {
        // Native Android TTS can only be started or stopped
        if (isPlaying) {
          window.Android.stop();
          if (speechProgressInterval.current) clearInterval(speechProgressInterval.current);
          setIsPlaying(false);
        } else {
           // Restart the speech
           if (speechProgressInterval.current) clearInterval(speechProgressInterval.current);
           setCurrentTime(0);
           const estimatedDuration = (speechUtterance.text.length / 10) * 1.1;
           setDuration(estimatedDuration);
           window.Android.speak(speechUtterance.text);
           setIsPlaying(true);
           speechProgressInterval.current = window.setInterval(() => {
              setCurrentTime(prev => {
                if (prev >= estimatedDuration) {
                  clearInterval(speechProgressInterval.current);
                  setIsPlaying(false);
                  onSpeechEnd?.();
                  return estimatedDuration;
                }
                return prev + 0.1;
              });
            }, 100);
        }
      } else if (window.speechSynthesis) {
        // Web TTS can be paused and resumed
        if (isPlaying) {
          window.speechSynthesis.pause();
        } else {
          window.speechSynthesis.resume();
        }
        setIsPlaying(!isPlaying);
      }
    } 
    // Logic for regular MP3 audio
    else {
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
    if (speechUtterance) return; // Disable seeking for speech
    
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

  // --- RENDER LOGIC (No changes needed here) ---
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
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            {speechUtterance && <Volume2 className="w-4 h-4 text-primary animate-pulse" />}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
                <div className="flex-1 relative h-1 rounded-full bg-muted">
                  <div 
                    className="absolute h-full bg-primary rounded-full"
                    style={{ 
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      transition: isPlaying ? 'none' : 'width 0.2s ease-in-out',
                    }}
                  />
                  {/* Disable seeking for speech mode */}
                  {!speechUtterance && (
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
                <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
