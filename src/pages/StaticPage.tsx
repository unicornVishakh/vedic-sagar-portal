import { useParams, Link } from "react-router-dom";
import { useStaticPage } from "@/hooks/useSupabaseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = useStaticPage(slug!);

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
    <div className="container mx-auto px-4 py-12">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">
            {page.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
              {page.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticPage;
