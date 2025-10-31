import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

// --- ADD THIS BLOCK ---
// This tells TypeScript that the "Android" object might exist on the window
interface AndroidInterface {
  speak: (text: string) => void;
  stop: () => void;
}
declare global {
  interface Window {
    Android?: AndroidInterface;
  }
}
// --- END BLOCK ---

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay = ({ content }: ContentDisplayProps) => {
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      // Only load web voices if the web API exists
      if (window.speechSynthesis) {
        setVoices(window.speechSynthesis.getVoices());
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

  const handlePlayAudio = useCallback((text: string, title: string) => {
    if (!text || text.trim().length === 0) {
      setCurrentUtterance(null);
      setCurrentTitle("");
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (window.Android && window.Android.stop) window.Android.stop();
      return;
    }

    // --- MODIFIED LOGIC ---
    if (window.Android && window.Android.speak) {
      // 1. NATIVE ANDROID APP
      if (window.speechSynthesis) window.speechSynthesis.cancel(); // Stop any web speech
      setCurrentUtterance(null); // Ensure web player is hidden
      setCurrentTitle("");
      
      // Use the native bridge to speak.
      // NOTE: Your original code only spoke the 'fullCardText', not the title.
      // We are preserving that by only speaking the 'text' argument.
      window.Android.speak(text);

    } else if (window.speechSynthesis) {
      // 2. WEB BROWSER (This is your original logic, restored)
      window.speechSynthesis.cancel();

      setTimeout(() => {
        const MAX_LENGTH = 4000;
        const truncatedText = text.length > MAX_LENGTH 
          ? text.substring(0, MAX_LENGTH) + "..." 
          : text;

        // Create the utterance as before
        const utterance = new SpeechSynthesisUtterance(truncatedText);

        const indianVoice = voices.find(voice =>
          voice.lang.includes('hi') || voice.lang.includes('sa') || voice.name.toLowerCase().includes('indian')
        );

        if (indianVoice) {
          utterance.voice = indianVoice;
          utterance.lang = indianVoice.lang;
        } else {
          utterance.lang = 'hi-IN';
        }

        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          setCurrentUtterance(null);
          setCurrentTitle("");
        };

        // The key: JUST set the state. The AudioPlayer component will do the rest.
        setCurrentUtterance(utterance);
        setCurrentTitle(title);
      }, 150);
    } else {
      // 3. NOT SUPPORTED
      console.warn("Speech Synthesis not supported in this environment.");
    }
    // --- END MODIFIED LOGIC ---

  }, [voices]);

  const handleSpeechEnd = useCallback(() => {
    // This is for the web AudioPlayer
    setCurrentUtterance(null);
    setCurrentTitle("");
  }, []);

  return (
    <>
      <div className="space-y-8">
        {content.split('\n---\n').map((majorSection, majorIdx) => {
          const trimmedMajorSection = majorSection.trim();
          if (!trimmedMajorSection) return null;

          const sections = trimmedMajorSection.split('\n\n').filter(s => s.trim());
          if (sections.length === 0) return null;

          const firstSection = sections[0].trim();
          const lines = firstSection.split('\n');
          const cardTitle = lines[0];
          const cardContent = lines.slice(1).join('\n').trim();

          const fullCardText = sections.join('\n\n');

          return (
            <Card key={majorIdx} className="shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-primary flex-1 no-underline">
                      {cardTitle}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => handlePlayAudio(fullCardText, cardTitle)}
                    >
                      <Volume2 className="w-5 h-5 text-primary" />
                    </Button>
                  </div>
                  
                  {cardContent && (
                    <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90 mb-4">
                      {cardContent}
                    </pre>
                  )}

                  {sections.slice(1).map((section, idx) => {
                    const trimmedSection = section.trim();
                    if (!trimmedSection) return null;

                    return (
                      <div key={idx} className="py-4 border-t">
                        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                          {trimmedSection}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* This will ONLY appear in web browsers, which is the original, correct behavior. */}
      {currentUtterance && (
        <AudioPlayer 
          speechUtterance={currentUtterance} 
          title={currentTitle}
          onSpeechEnd={handleSpeechEnd}
        />
      )}
    </>
  );
};

export default ContentDisplay;
