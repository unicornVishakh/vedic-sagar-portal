import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Wait for fade out
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-background to-white px-6 py-12 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
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

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl md:text-5xl font-bold text-secondary">आर्य समाज</h2>
        <p className="text-sm text-muted-foreground">Built and Maintained by Neural AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;
