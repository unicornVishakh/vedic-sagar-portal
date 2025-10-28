import { useParams, Link } from "react-router-dom";
import { useFestivalMantras, useFestivals } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Volume2 } from "lucide-react";
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";

const FestivalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: mantras, isLoading: mantrasLoading } = useFestivalMantras(id!);
  const { data: festivals } = useFestivals();
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  
  const festival = festivals?.find(f => f.festival_id === Number(id));

  const handlePlayAudio = async (text: string, title: string) => {
    setCurrentTitle(title);
    // Generate audio URL using text-to-speech
    const audioUrl = await generateSanskritAudio(text);
    setCurrentAudio(audioUrl);
  };

  const generateSanskritAudio = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        'https://ugoimceidzwjytznhwig.supabase.co/functions/v1/text-to-speech',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating audio:', error);
      return "";
    }
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

      {/* Fixed Audio Player */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto px-4 py-3">
            <AudioPlayer audioUrl={currentAudio} title={currentTitle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalDetail;
