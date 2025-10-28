import { useNews } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, User, Calendar } from "lucide-react";

const News = () => {
  const { data: news, isLoading } = useNews();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Latest News</h1>
        <p className="text-muted-foreground text-lg">
          Stay updated with the latest announcements and happenings.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {news?.map((article) => (
            <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-3">
                {article.image_url && (
                  <div className="md:col-span-1 h-48 md:h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">{article.title}</CardTitle>
                    <CardDescription className="pt-2">
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        {article.author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{article.content}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
