import React, { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
// Removed Prism import

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioRef] = useState(() => new Audio("/assets/ancient-spirit-echoes-om-chanting-234045.mp3"));
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

  // Setup audio on mount
  useEffect(() => {
    audioRef.loop = true;
    audioRef.volume = 0.7;
    
    const playAudio = async () => {
      try {
        await audioRef.play();
        setAudioStarted(true);
      } catch (error) {
        // Autoplay blocked on mobile - will be started on user interaction
        console.log("Audio autoplay prevented - waiting for user interaction");
      }
    };
    
    // Try to play on desktop (usually works)
    if (!isMobile) {
      playAudio();
    }
    
    return () => {
      audioRef.pause();
      audioRef.currentTime = 0;
    };
  }, [audioRef, isMobile]);

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
            handleComplete(); // Call completion handler
            return 100;
          }
          return prev + 2; // Increment progress
        });
      }, 60); // Adjust interval timing as needed (~3 seconds total)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
    // Note: No auto-completion on mobile - user must slide
  }, [isMobile, handleComplete]); // Include handleComplete in dependencies

  // Handle slider movement for mobile
  const handleSliderMove = (clientX: number) => {
    if (!isDragging) return;

    const slider = document.getElementById("splash-slider");
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const maxWidth = rect.width - 60; // Slider width minus handle width
    const newPosition = Math.max(0, Math.min(clientX - rect.left - 30, maxWidth)); // Calculate new position within bounds

    setSliderPosition(newPosition);

    // Trigger completion if slider reaches near the end
    if (newPosition >= maxWidth * 0.95) {
      setIsDragging(false); // Stop dragging
      handleComplete(); // Call completion handler
    }
  };

  // Start dragging on mouse down or touch start
  const handleMouseDown = async (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault(); // Prevent text selection during drag
      setIsDragging(true);
      
      // Start audio on first user interaction (mobile)
      if (!audioStarted && isMobile) {
        try {
          await audioRef.play();
          setAudioStarted(true);
        } catch (error) {
          console.log("Failed to play audio:", error);
        }
      }
  };

  // Stop dragging and potentially reset slider on mouse up, leave, or touch end
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      const slider = document.getElementById("splash-slider");
      const maxWidth = slider ? slider.getBoundingClientRect().width - 60 : 200; // Recalculate maxWidth safely
       // Check if completion threshold was met *before* resetting
       if (sliderPosition < maxWidth * 0.95) {
         // Use setTimeout to allow visual completion before snapping back
         setTimeout(() => setSliderPosition(0), 50);
       }
    }
  };

  // Handle touch movement
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // Handle mouse movement (only when dragging)
  const handleMouseMove = (e: React.MouseEvent) => {
     if (isDragging) { // Ensure dragging has started
        handleSliderMove(e.clientX);
     }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-background to-white px-6 py-12 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none" // Fade out and disable interaction when hidden
      }`}
    >
      {/* Top Section: Om Symbol Image */}
      <div className="flex-1 flex items-center justify-center pt-8">
        <img
          src="/assets/O3m_AryaSamaj.png" // Use the Ohm image
          alt="Ohm Symbol"
          className="h-24 w-auto md:h-32" // Adjust size as needed
        />
      </div>

      {/* Middle Section: Rishi Image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm px-4"> {/* Adjusted max-w */}
        <div className="w-full h-full aspect-square relative flex items-center justify-center"> {/* Use full container size */}
          {/* Rishi Image - Ensure rishi-yagya-loop.jpg is in public/assets/ */}
          <img
            src="/assets/task_01k8m963hwfngaxjxj1nf2t5j7_1761617406_img_1.webp" // Using the JPG file name
            alt="Rishi performing Yagya"
            className="w-56 h-56 md:w-80 md:h-80 object-contain pointer-events-none rounded-full" // Increased size significantly
            style={{ imageRendering: 'pixelated' }} // Optional: Keeps sharp edges
          />
        </div>
      </div>

      {/* Bottom Section: Slider or Loading Bar */}
      <div className="w-full max-w-md px-4 mb-6"> {/* Reduced bottom margin */}
        {isMobile ? (
          <div
            id="splash-slider"
            className="relative h-16 bg-secondary/20 rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none" // Added select-none
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp} // Reset if mouse leaves slider
             onTouchEnd={handleMouseUp}
             // MouseMove is handled by the handle below
          >
            {/* Background fill */}
            <div
              className="absolute inset-y-0 left-0 bg-primary/30 rounded-full transition-width duration-100 ease-linear" // Use transition-width
              style={{ width: `${sliderPosition + 60}px` }}
            />
             {/* Draggable Handle */}
            <div
              className="absolute inset-y-0 left-0 flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg transition-transform duration-100 ease-linear active:scale-95"
              style={{ transform: `translateX(${sliderPosition}px)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onTouchMove={handleTouchMove}
              onMouseMove={handleMouseMove} // Handle mouse move specifically on the handle
            >
              <ChevronRight className="w-8 h-8 text-primary-foreground" />
            </div>
             {/* Text Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                 className="text-sm font-medium text-muted-foreground transition-opacity duration-200"
                 style={{ opacity: sliderPosition > 10 ? 0 : 1 }} // Fade out text as slider moves
              >
                Slide to Enter
              </span>
            </div>
          </div>
        ) : (
           // Desktop Loading Bar
          <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

       {/* Footer Text */}
      <div className="flex flex-col items-center justify-center gap-2 pb-4"> {/* Adjusted gap */}
        <div className="flex items-center gap-2"> {/* New flex container for logo and text */}
            <img
                src="/assets/download.png" // Use the Arya Samaj logo image
                alt="Arya Samaj Logo"
                className="h-10 w-auto md:h-12" // Adjust size
            />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">ARYA SAMAJ</h2> {/* Added Text */}
        </div>
        <p className="text-xs text-muted-foreground">Built and Maintained by Neural AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;
