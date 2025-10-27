import { useParams, Link } from "react-router-dom";
import { useFestivalMantras, useFestivals } from "@/hooks/useSupabaseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

const FestivalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: mantras, isLoading: mantrasLoading } = useFestivalMantras(id!);
  const { data: festivals } = useFestivals();
  
  const festival = festivals?.find(f => f.festival_id === Number(id));

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
    <div className="container mx-auto px-4 py-12">
      <Link to="/festivals">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Festivals
        </Button>
      </Link>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl md:text-3xl text-center">
              {festival?.name || "Festival"} Mantras
            </CardTitle>
          </div>
          {festival?.description && (
            <p className="text-center text-muted-foreground mt-2">{festival.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {mantras.map((mantra) => (
            <div key={mantra.mantra_id} className="border-l-4 border-primary pl-4 py-2">
              {mantra.purpose && (
                <h3 className="font-semibold text-lg mb-2 text-secondary">{mantra.purpose}</h3>
              )}
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                {mantra.mantra_text}
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FestivalDetail;
