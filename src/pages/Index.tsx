import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import MainPage from "./MainPage";

const Index = () => {
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only show splash on the root path "/"
    if (location.pathname === "/") {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate("/home", { replace: true });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, navigate]);

  if (showSplash && location.pathname === "/") {
    return <SplashScreen />;
  }

  return <MainPage />;
};

export default Index;
