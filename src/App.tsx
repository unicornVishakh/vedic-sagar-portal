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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
