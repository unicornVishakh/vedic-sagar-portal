import { Link } from "react-router-dom";
import { useFestivals } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

const FestivalList = () => {
  const { data: festivals, isLoading } = useFestivals();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Tyohar Mantra Kosh</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {festivals?.map((festival) => (
            <Link key={festival.festival_id} to={`/festival/${festival.festival_id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                  <Calendar className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{festival.name}</h3>
                  {festival.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {festival.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalList;
