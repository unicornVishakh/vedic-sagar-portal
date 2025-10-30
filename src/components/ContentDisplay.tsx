import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay = ({ content }: ContentDisplayProps) => {
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlayAudio = useCallback((text: string, title: string) => {
    if (!text || text.trim().length === 0) {
      setCurrentUtterance(null);
      setCurrentTitle("");
      window.speechSynthesis.cancel();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait for cancellation to complete
    setTimeout(() => {
      // Limit text length to prevent browser limitations (most browsers have ~32KB limit)
      const MAX_LENGTH = 4000;
      const truncatedText = text.length > MAX_LENGTH 
        ? text.substring(0, MAX_LENGTH) + "..." 
        : text;

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

      // Handle speech errors
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setCurrentUtterance(null);
        setCurrentTitle("");
      };

      setCurrentUtterance(utterance);
      setCurrentTitle(title);
    }, 150);
  }, [voices]);

  const handleSpeechEnd = useCallback(() => {
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
