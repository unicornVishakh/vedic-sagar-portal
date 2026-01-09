import ContentBlock from "@/components/ContentBlock";
import { useContentSections } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/components/ui/banner";
import { Heart, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

const MainPage = () => {
  const { data: sections, isLoading } = useContentSections();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play background audio
  useEffect(() => {
    const audio = new Audio("https://ugoimceidzwjytznhwig.supabase.co/storage/v1/object/public/assets/audio/ancient-spirit-echoes-om-chanting-234045.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const playAudio = () => {
      if (!document.hidden) {
        audio.play().catch(() => {});
      }
    };

    // Try to play immediately
    playAudio();

    // Also try on user interaction
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => document.addEventListener(event, playAudio, { once: true }));

    // Pause when app is minimized or phone is locked
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      events.forEach(event => document.removeEventListener(event, playAudio));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen">
      {/* Banner with integrated announcement */}
      <div className="w-full h-64 md:h-96 overflow-hidden relative">
        <video
          src="/assets/Satyug_Yagya_Cinematic_Masterpiece.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        {showBanner && (
          <div className="absolute top-4 left-0 right-0 px-2 sm:px-4 z-10">
            <Banner
              show={showBanner}
              onHide={() => setShowBanner(false)}
              variant="gradient"
              title="Support Our Mission"
              description="Help us preserve and share Vedic knowledge with the world"
              showShade={true}
              closable={true}
              autoHide={5000}
              icon={<Heart className="w-5 h-5 text-primary-foreground" />}
              className="text-xs sm:text-sm"
              action={
                <Button
                  onClick={() => navigate("/donate-form")}
                  size="sm"
                  className="gap-1 text-xs sm:text-sm px-2 sm:px-3"
                  variant="default"
                >
                  Donate Now
                  <ArrowRight className="h-3 w-3" />
                </Button>
              }
            />
          </div>
        )}
        
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Explore Vedic Knowledge
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {sections?.map((section) => (
              <ContentBlock key={section.section_id} section={section} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
