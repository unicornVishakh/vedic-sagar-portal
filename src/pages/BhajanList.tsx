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
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl mx-auto">
          {bhajans?.map((bhajan) => (
            <Link key={bhajan.bhajan_id} to={`/bhajan/${bhajan.bhajan_id}`}>
              <Card className="hover:shadow-md transition-all hover:border-primary/50 hover:bg-accent/50 cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <h3 className="font-medium text-base">{bhajan.title}</h3>
                  <Music className="w-5 h-5 text-primary ml-3 flex-shrink-0" />
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
