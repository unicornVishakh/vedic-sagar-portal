import { useParams, Link } from "react-router-dom";
import { useBhajan } from "@/hooks/useSupabaseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music } from "lucide-react";

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
    <div className="container mx-auto px-4 py-12">
      <Link to="/bhajans">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bhajans
        </Button>
      </Link>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl md:text-3xl text-center">{bhajan.title}</CardTitle>
          </div>
          {bhajan.author && (
            <p className="text-center text-muted-foreground">by {bhajan.author}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
              {bhajan.lyrics}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BhajanDetail;
