import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import BhajanList from "./pages/BhajanList";
import BhajanDetail from "./pages/BhajanDetail";
import FestivalList from "./pages/FestivalList";
import FestivalDetail from "./pages/FestivalDetail";
import StaticPage from "./pages/StaticPage";
import DonationPage from "./pages/DonationPage";
import DonateFormPage from "./pages/DonateFormPage";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import News from "./pages/News";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// --- 1. IMPORT THE NEW PROVIDER ---
import { AndroidBridgeProvider } from './contexts/AndroidBridgeContext';

const queryClient = new QueryClient();

// Global visibility change handler to stop all audio when app is hidden
const useGlobalAudioCleanup = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop web speech synthesis
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        // Stop Android TTS
        if ((window as any).Android?.stop) {
          (window as any).Android.stop();
        }
        // Pause all audio elements
        document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
          audio.pause();
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle beforeunload for when tab is closed
    const handleBeforeUnload = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if ((window as any).Android?.stop) {
        (window as any).Android.stop();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

const AppContent = () => {
  useGlobalAudioCleanup();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Layout><Index /></Layout>} />
        <Route path="/bhajans" element={<Layout><BhajanList /></Layout>} />
        <Route path="/bhajan/:id" element={<Layout><BhajanDetail /></Layout>} />
        <Route path="/festivals" element={<Layout><FestivalList /></Layout>} />
        <Route path="/festival/:id" element={<Layout><FestivalDetail /></Layout>} />
        <Route path="/page/:slug" element={<Layout><StaticPage /></Layout>} />
        <Route path="/donation" element={<Layout><DonationPage /></Layout>} />
        <Route path="/donate-form" element={<Layout><DonateFormPage /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/event/:id" element={<Layout><EventDetail /></Layout>} />
        <Route path="/news" element={<Layout><News /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* --- 2. WRAP YOUR APP WITH THE PROVIDER --- */}
      <AndroidBridgeProvider>
        <AppContent />
      </AndroidBridgeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
