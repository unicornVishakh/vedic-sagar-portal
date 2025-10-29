import { useParams, Link } from "react-router-dom";
import { useStaticPage } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";

const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = useStaticPage(slug!);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices properly with better handling
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
      }
    };

    // Try to load voices immediately
    loadVoices();
    
    // Also set up the event listener for when voices change
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlayAudio = (text: string, title: string) => {
    // Cancel any ongoing speech immediately
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    // Wait for cancellation to complete before starting new speech
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to find an Indian voice
      const indianVoice = voices.find(voice => 
        voice.lang.includes('hi') || voice.lang.includes('sa') || voice.name.toLowerCase().includes('indian')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      // Don't set event handlers here - let AudioPlayer handle them
      setCurrentUtterance(utterance);
      setCurrentTitle(title);
    }, 150);
  };

  const handleSpeechEnd = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
    setCurrentTitle("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Page not found</p>
        <Link to="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/home">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Title Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-y">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary">
            {page.title}
          </h1>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl pb-32">
        {page.content.split('\n\n').map((section, idx) => {
          const lines = section.split('\n');
          const title = lines[0];
          const content = lines.slice(1).join('\n');
          
          return (
            <div key={idx} className="mb-8 border-l-4 border-primary pl-6 py-3 bg-card rounded-r-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary mb-3">{title}</h2>
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                    {content}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 mt-1"
                  onClick={() => handlePlayAudio(content, title)}
                >
                  <Volume2 className="w-5 h-5 text-primary" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Audio Player */}
      {currentUtterance && (
        <AudioPlayer 
          speechUtterance={currentUtterance} 
          title={currentTitle}
          onSpeechEnd={handleSpeechEnd}
        />
      )}
    </div>
  );
};

export default StaticPage;
