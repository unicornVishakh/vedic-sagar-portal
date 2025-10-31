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
  
  // --- NEW ---
  // State to track if we are in native Android mode
  const [isAndroidMode, setIsAndroidMode] = useState(false);

  // --- NEW ---
  // Listen for the signal from the Android app
  useEffect(() => {
    // This function will be called by the Android app's onPageFinished
    (window as any).androidBridgeReady = () => {
      console.log("Android bridge is ready!");
      setIsAndroidMode(true);
    };

    // Cleanup
    return () => {
      delete (window as any).androidBridgeReady;
    };
  }, []);
  
  // This is for regular audio files (MP3s)
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

  // Handle speech synthesis (BOTH NATIVE AND WEB)
  useEffect(() => {
    if (!speechUtterance) {
      return;
    }

    // --- UPDATED LOGIC ---
    // 1. Prioritize Native Android TTS
    if (isAndroidMode && window.Android) {
      console.log("Using Native Android TTS");
      // For native, we don't have progress events, so we just play.
      // We can keep a simple visual timer if desired.
      setIsPlaying(true);
      window.Android.speak(speechUtterance.text);
      
      // Since we don't know when it ends, the onSpeechEnd callback is harder
      // to trigger accurately without more native code. This is a simplification.

      return () => {
        // Stop native speech when component unmounts or utterance changes
        if (window.Android) {
          window.Android.stop();
        }
      };
    } 
    // 2. Fallback to Web TTS
    else if (window.speechSynthesis) {
      console.log("Using Web Browser TTS");
      setIsPlaying(true);
      window.speechSynthesis.speak(speechUtterance);

      speechUtterance.onend = () => {
        setIsPlaying(false);
        onSpeechEnd?.();
      };

      speechUtterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.error('Web Speech error:', event.error);
        setIsPlaying(false);
        onSpeechEnd?.();
      };
      
      return () => {
        window.speechSynthesis.cancel();
      };
    }
    // 3. If neither is available
    else {
      console.log("Speech Synthesis not supported in this environment.");
    }
    
  }, [speechUtterance, onSpeechEnd, isAndroidMode]);

  const togglePlay = () => {
    // --- UPDATED LOGIC ---
    if (speechUtterance) {
      // For native, we can only start/stop, not pause/resume
      if (isAndroidMode && window.Android) {
        if (isPlaying) {
          window.Android.stop();
          setIsPlaying(false);
        } else {
          window.Android.speak(speechUtterance.text);
          setIsPlaying(true);
        }
      }
      // For web, we can pause/resume
      else if (window.speechSynthesis) {
        if (isPlaying) {
          window.speechSynthesis.pause();
        } else {
          window.speechSynthesis.resume();
        }
        setIsPlaying(!isPlaying);
      }
    }
    // For regular audio files
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

  // ... (The rest of your component's rendering code remains the same)
  // ... (handleSeek, formatTime, and the JSX return)
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Seeking is disabled for both speech modes
    if (speechUtterance) {
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
              aria-label={isPlaying ? "Pause" : "Stop"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {speechUtterance && (
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {/* Simplified time for native TTS */}
                  {formatTime(isAndroidMode && speechUtterance ? 0 : currentTime)}
                </span>
                <div className="flex-1 relative h-1 rounded-full bg-muted">
                  <div 
                    className="absolute h-full bg-primary rounded-full"
                    // Simplified progress for native TTS
                    style={{ width: `${ (isAndroidMode && speechUtterance && isPlaying) ? '100%' : (duration > 0 ? (currentTime / duration) * 100 : 0)}%`, transition: (isAndroidMode && speechUtterance) ? 'width 10s linear' : 'width 0.1s linear' }}
                  />
                  {!(isAndroidMode && speechUtterance) && (
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
                  {formatTime(isAndroidMode && speechUtterance ? 0 : duration)}
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
