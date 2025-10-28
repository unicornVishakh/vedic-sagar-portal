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

  // Detect mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoized version of handleComplete
  const handleComplete = useCallback(() => {
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 500); // Delay matches fade-out duration
    }
  }, [onComplete]);

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
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault(); // Prevent text selection during drag
      setIsDragging(true);
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
      {/* Top Section: Om Symbol */}
      <div className="flex-1 flex items-center justify-center pt-8"> {/* Added padding top */}
        <h1 className="text-8xl md:text-9xl font-bold text-primary">ॐ</h1>
      </div>

      {/* Middle Section: Rishi Image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-xs px-4"> {/* Added padding */}
        <div className="w-full h-full aspect-square relative flex items-center justify-center"> {/* Use full container size */}
          {/* Rishi Image - Ensure rishi-yagya-loop.jpg is in public/assets/ */}
          <img
            src="/assets/task_01k8m963hwfngaxjxj1nf2t5j7_1761617406_img_1.webp" // Using the JPG file name
            alt="Rishi performing Yagya"
            className="w-48 h-48 md:w-64 md:h-64 object-contain pointer-events-none rounded-full" // Increased size
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
      <div className="flex flex-col items-center justify-center gap-1 pb-4"> {/* Reduced gap, added padding bottom */}
        <h2 className="text-3xl md:text-4xl font-bold text-secondary">आर्य समाज</h2>
        <p className="text-xs text-muted-foreground">Built and Maintained by Neural AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;
