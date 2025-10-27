import { useEffect, useState } from "react";
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      // Desktop: Auto-progress loading bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 60); // Complete in ~3 seconds

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const handleComplete = () => {
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  const handleSliderMove = (clientX: number) => {
    if (!isDragging) return;
    
    const slider = document.getElementById("splash-slider");
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const maxWidth = rect.width - 60; // Subtract button width
    const newPosition = Math.max(0, Math.min(clientX - rect.left - 30, maxWidth));
    
    setSliderPosition(newPosition);
    
    if (newPosition >= maxWidth * 0.9) {
      handleComplete();
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderPosition < 200) {
      setSliderPosition(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-background to-white px-6 py-12 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-8xl md:text-9xl font-bold text-primary">ॐ</h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1604608672516-f1b9b1f36a4f?w=800&auto=format&fit=crop"
            alt="Sacred Yagya"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {isMobile ? (
        <div className="w-full max-w-md px-4 mb-8">
          <div
            id="splash-slider"
            className="relative h-16 bg-secondary/20 rounded-full overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary/20 rounded-full transition-all"
              style={{ width: `${sliderPosition + 60}px` }}
            />
            <div
              className="absolute inset-y-0 left-0 flex items-center justify-center w-16 h-16 bg-primary rounded-full cursor-pointer shadow-lg transition-transform active:scale-95"
              style={{ transform: `translateX(${sliderPosition}px)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onTouchMove={handleTouchMove}
            >
              <ChevronRight className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-medium text-muted-foreground">
                Slide to Enter
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md px-4 mb-8">
          <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl md:text-5xl font-bold text-secondary">आर्य समाज</h2>
        <p className="text-sm text-muted-foreground">Built and Maintained by Neural AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;
