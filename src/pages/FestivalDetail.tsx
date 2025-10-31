import { useParams, Link } from "react-router-dom";
import { useFestivalMantras, useFestivals } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import AudioPlayer from "@/components/AudioPlayer";

// 1. IMPORT THE NEW HOOK
import { useAndroidBridge } from "@/contexts/AndroidBridgeContext";

const FestivalDetail = () => {
  // 2. GET THE BRIDGE STATE FROM THE CONTEXT
  const { isBridgeReady } = useAndroidBridge();

  const { id } = useParams<{ id: string }>();
  const { data: mantras, isLoading: mantrasLoading } = useFestivalMantras(id!);
  const { data: festivals } = useFestivals();
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  
  const festival = festivals?.find(f => f.festival_id === Number(id));

  // Load voices properly with better handling
  useEffect(() => {
    const loadVoices = () => {
      // Only load web voices if the web API exists
      if (window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          setVoicesLoaded(true);
        }
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    };

    loadVoices();
    
    return () => {
      // Stop both web and native speech on cleanup
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
      if (window.Android && window.Android.stop) {
        window.Android.stop();
      }
    };
  }, []);

  const handlePlayAudio = (text: string, title: string) => {
    
    // --- 3. UPDATED LOGIC ---
    if (window.Android && isBridgeReady) {
      // 1. NATIVE ANDROID APP (and bridge is ready)
      if (window.speechSynthesis) window.speechSynthesis.cancel(); // Stop any web speech
      setCurrentUtterance(null); // Ensure web player is hidden
      setCurrentTitle("");
      
      // Use the native bridge to speak.
      window.Android.speak(title + ". " + text);

    } else if (window.speechSynthesis) {
      // 2. WEB BROWSER (Your original, working logic)
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(title + ". " + text); // Combine title and text
        utterance.lang = 'hi-IN';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const indianVoice = voices.find(voice => 
          voice.lang.includes('hi') || voice.lang.includes('sa') || voice.name.toLowerCase().includes('indian')
        );
        
        if (indianVoice) {
          utterance.voice = indianVoice;
        }
        
        // Pass to the AudioPlayer component
        setCurrentUtterance(utterance);
        setCurrentTitle(title);
      }, 150);
    } else {
      // 3. NOT SUPPORTED (or bridge not ready yet)
      console.warn("Speech Synthesis not supported in this environment.");
    }
    // --- END LOGIC UPDATE ---
  };

  const handleSpeechEnd = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
    setCurrentTitle("");
  };

  if (mantrasLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!mantras || mantras.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">No mantras found for this festival</p>
        <Link to="/festivals">
          <Button className="mt-4">Back to Festivals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/festivals">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Festivals
          </Button>
        </Link>
      </div>

      {/* Title Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-y">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              {festival?.name || "Festival"} Mantras
            </h1>
          </div>
          {festival?.description && (
            <p className="text-center text-muted-foreground mt-2">{festival.description}</p>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl pb-32">
        <div className="space-y-6">
          {mantras.map((mantra) => (
            <div key={mantra.mantra_id} className="border-l-4 border-primary pl-6 py-3 bg-card rounded-r-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {mantra.purpose && (
                    <h3 className="font-semibold text-xl mb-3 text-primary">{mantra.purpose}</h3>
                  )}
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                    {mantra.mantra_text}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 mt-1"
                  onClick={() => handlePlayAudio(mantra.mantra_text, mantra.purpose || "Mantra")}
                >
                  <Volume2 className="w-5 h-5 text-primary" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This will ONLY appear in web browsers, not in the Android app. */}
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

export default FestivalDetail;
