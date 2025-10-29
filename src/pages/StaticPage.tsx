import { useParams, Link } from "react-router-dom";
import { useStaticPage } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = useStaticPage(slug!);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices from the browser
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup function to stop any speech when the component unmounts
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

    // Always cancel any previous speech before starting a new one.
    window.speechSynthesis.cancel();

    // Use a brief timeout to ensure the cancel command has time to execute.
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      const indianVoice = voices.find(voice =>
        voice.lang.includes('hi') || voice.lang.includes('sa') || voice.name.toLowerCase().includes('indian')
      );

      if (indianVoice) {
        utterance.voice = indianVoice;
        utterance.lang = indianVoice.lang;
      } else {
        utterance.lang = 'en-US'; // Fallback language
      }

      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      setCurrentUtterance(utterance);
      setCurrentTitle(title);
    }, 100); // A short delay of 100ms is sufficient.

  }, [voices]); // Dependency array includes 'voices'

  const handleSpeechEnd = useCallback(() => {
    setCurrentUtterance(null);
    setCurrentTitle("");
  }, []);

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

      {/* Content Body - NEW LAYOUT */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl pb-32">
        <div className="space-y-8">
          {page.content.split('\n---\n').map((majorSection, majorIdx) => {
            const trimmedMajorSection = majorSection.trim();
            if (!trimmedMajorSection) return null;

            return (
              <Card key={majorIdx} className="shadow-md">
                <CardContent className="p-4 md:p-6">
                  {trimmedMajorSection.split('\n\n').map((section, idx) => {
                    const trimmedSection = section.trim();
                    if (!trimmedSection) return null;

                    const lines = trimmedSection.split('\n');
                    const title = lines[0];
                    const content = lines.slice(1).join('\n').trim();

                    return (
                      <div key={idx} className="relative py-4 border-b last:border-b-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 pr-12">
                            <h2 className={`text-xl mb-2 ${content ? 'font-bold text-primary' : 'font-semibold'}`}>
                              {title}
                            </h2>
                            {content && (
                              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
                                {content}
                              </pre>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-0 flex-shrink-0"
                            onClick={() => handlePlayAudio(content || title, title)}
                          >
                            <Volume2 className="w-5 h-5 text-primary" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
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
