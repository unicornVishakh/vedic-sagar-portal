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

// --- 1. IMPORT THE NEW PROVIDER ---
import { AndroidBridgeProvider } from './contexts/AndroidBridgeContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* --- 2. WRAP YOUR APP WITH THE PROVIDER --- */}
      <AndroidBridgeProvider>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AndroidBridgeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
