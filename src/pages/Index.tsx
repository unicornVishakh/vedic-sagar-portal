import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import MainPage from "./MainPage";

const Index = () => {
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShownSplash = sessionStorage.getItem("splashShown");
    
    // Only show splash on the root path "/" and if not shown before in this session
    if (location.pathname === "/" && !hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    } else if (location.pathname === "/") {
      // If splash already shown, redirect directly to home
      navigate("/home", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate("/home", { replace: true });
  };

  if (showSplash && location.pathname === "/") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <MainPage />;
};

export default Index;
