import { useParams, Link } from "react-router-dom";
import { useBhajan } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

const BhajanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bhajan, isLoading } = useBhajan(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!bhajan) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Bhajan not found</p>
        <Link to="/bhajans">
          <Button className="mt-4">Back to Bhajan List</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col pb-24">
        <div className="container mx-auto px-4 py-6">
          <Link to="/bhajans">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bhajans
            </Button>
          </Link>
        </div>

        {/* Title Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-y">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Music className="w-6 h-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-center">{bhajan.title}</h1>
            </div>
            {bhajan.author && (
              <p className="text-center text-muted-foreground">by {bhajan.author}</p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
            {bhajan.lyrics}
          </pre>
        </div>
      </div>

      {/* Fixed Audio Player */}
      <AudioPlayer 
        audioUrl={(bhajan as any).audio_url} 
        title={bhajan.title} 
      />
    </>
  );
};

export default BhajanDetail;
