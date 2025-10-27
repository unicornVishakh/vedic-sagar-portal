import { Link } from "react-router-dom";
import { useBhajans } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music } from "lucide-react";

const BhajanList = () => {
  const { data: bhajans, isLoading } = useBhajans();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Music className="w-8 h-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Bhajan Kosh</h1>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-w-4xl mx-auto">
          {bhajans?.map((bhajan) => (
            <Link key={bhajan.bhajan_id} to={`/bhajan/${bhajan.bhajan_id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{bhajan.title}</h3>
                    {bhajan.author && (
                      <p className="text-xs text-muted-foreground truncate">by {bhajan.author}</p>
                    )}
                  </div>
                  <Music className="w-4 h-4 text-muted-foreground ml-3 flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BhajanList;
