import { Link } from "react-router-dom";
import { useBhajans } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music } from "lucide-react";

const BhajanList = () => {
  const { data: bhajans, isLoading } = useBhajans();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Music className="w-8 h-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Bhajan Kosh</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {bhajans?.map((bhajan) => (
            <Link key={bhajan.bhajan_id} to={`/bhajan/${bhajan.bhajan_id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{bhajan.title}</h3>
                    {bhajan.author && (
                      <p className="text-sm text-muted-foreground">by {bhajan.author}</p>
                    )}
                  </div>
                  <Music className="w-5 h-5 text-muted-foreground" />
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
