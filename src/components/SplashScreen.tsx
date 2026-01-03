import React, { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // UPDATED: Pointing to the new audio file (URL encoded for spaces)
  const [audioRef] = useState(() => new Audio("/assets/WhatsApp%20Video%202026-01-03%20at%2019.05.23.mp3"));
  const [audioStarted, setAudioStarted] = useState(false);

  // Detect mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Setup audio on mount - aggressive autoplay
  useEffect(() => {
    // UPDATED: User requested "play only once", so loop is disabled
    audioRef.loop = false; 
    audioRef.volume = 1.0; // Ensure volume is audible
    
    const attemptPlay = async () => {
      try {
        await audioRef.play();
        setAudioStarted(true);
        return true;
      } catch {
        return false;
      }
    };
    
    // Try immediately
    attemptPlay();
    
    // Also try on any document interaction (backup if autoplay is blocked)
    const handleInteraction = async () => {
      if (!audioStarted) {
        const success = await attemptPlay();
        if (success) {
          // Remove listeners once played
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
          document.removeEventListener('scroll', handleInteraction);
          document.removeEventListener('keydown', handleInteraction);
        }
      }
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    return () => {
      audioRef.pause();
      audioRef.currentTime = 0;
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [audioRef, audioStarted]);

  // Handle audio playback on specific screen interaction (redundant backup)
  const handleScreenInteraction = async () => {
    if (!audioStarted) {
      try {
        audioRef.muted = false;
        audioRef.volume = 1.0;
        await audioRef.play();
        setAudioStarted(true);
      } catch (error) {
        console.log("Failed to play audio:", error);
      }
    }
  };

  // Memoized version of handleComplete
  const handleComplete = useCallback(() => {
    // Stop audio when completing
    audioRef.pause();
    audioRef.currentTime = 0;
    
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 500); // Delay matches fade-out duration
    }
  }, [onComplete, audioRef]);

  // Handle desktop loading bar progress and auto-completion
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isMobile, handleComplete]);

  // Play slider tick sound (Optional: kept for slider UI feedback)
  const playSliderSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silent fail
    }
  }, []);

  // Handle slider movement for mobile
  const handleSliderMove = (clientX: number) => {
    if (!isDragging) return;

    const slider = document.getElementById("splash-slider");
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const maxWidth = rect.width - 60;
    const newPosition = Math.max(0, Math.min(clientX - rect.left - 30, maxWidth));

    if (Math.abs(newPosition - sliderPosition) > 20) {
      playSliderSound();
    }

    setSliderPosition(newPosition);

    if (newPosition >= maxWidth * 0.95) {
      setIsDragging(false);
      handleComplete();
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const slider = document.getElementById("splash-slider");
      const maxWidth = slider ? slider.getBoundingClientRect().width - 60 : 200;
       if (sliderPosition < maxWidth * 0.95) {
         setTimeout(() => setSliderPosition(0), 50);
       }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
     if (isDragging) {
        handleSliderMove(e.clientX);
     }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-background to-white px-6 py-12 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
    >
      {/* Top Section: Om Symbol Image */}
      <div className="flex-1 flex items-center justify-center pt-8">
        <img
          src="/assets/O3m_AryaSamaj.png"
          alt="Ohm Symbol"
          className="h-24 w-auto md:h-32"
        />
      </div>

      {/* Middle Section: Rishi Image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm px-4">
        <div className="w-full h-full aspect-square relative flex items-center justify-center">
          <img
            src="/assets/task_01k8m963hwfngaxjxj1nf2t5j7_1761617406_img_1.webp"
            alt="Rishi performing Yagya"
            className="w-56 h-56 md:w-80 md:h-80 object-contain pointer-events-none rounded-full"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* Bottom Section: Slider or Loading Bar */}
      <div className="w-full max-w-md px-4 mb-6">
        {isMobile ? (
          <div
            id="splash-slider"
            className="relative h-16 bg-secondary/20 rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onTouchEnd={handleMouseUp}
          >
            {/* Background fill */}
            <div
              className="absolute inset-y-0 left-0 bg-primary/30 rounded-full transition-width duration-100 ease-linear"
              style={{ width: `${sliderPosition + 60}px` }}
            />
             {/* Draggable Handle */}
            <div
              className="absolute inset-y-0 left-0 flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg transition-transform duration-100 ease-linear active:scale-95"
              style={{ transform: `translateX(${sliderPosition}px)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onTouchMove={handleTouchMove}
              onMouseMove={handleMouseMove}
            >
              <ChevronRight className="w-8 h-8 text-primary-foreground" />
            </div>
             {/* Text Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                 className="text-sm font-medium text-muted-foreground transition-opacity duration-200"
                 style={{ opacity: sliderPosition > 10 ? 0 : 1 }}
              >
                Slide to Enter
              </span>
            </div>
          </div>
        ) : (
          <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

       {/* Footer Text */}
      <div className="flex flex-col items-center justify-center gap-2 pb-4">
        <div className="flex items-center gap-2">
            <img
                src="/assets/download.png"
                alt="Arya Samaj Logo"
                className="h-10 w-auto md:h-12"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">ARYA SAMAJ</h2>
        </div>
        <p className="text-xs text-muted-foreground">Built and Maintained by Neural AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;
