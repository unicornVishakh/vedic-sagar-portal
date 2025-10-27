import { Link } from "react-router-dom";
import { useFestivals } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

const FestivalList = () => {
  const { data: festivals, isLoading } = useFestivals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Tyohar Mantra Kosh</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {festivals?.map((festival) => (
            <Link key={festival.festival_id} to={`/festival/${festival.festival_id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50 h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[100px]">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-bold text-sm leading-tight">{festival.name}</h3>
                  {festival.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
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
