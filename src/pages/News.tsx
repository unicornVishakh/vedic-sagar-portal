import { useNews } from "../hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Link as LinkIcon } from "lucide-react";
import ContentRenderer from "../lib/content-parser";

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
        <div className="space-y-8 max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {news?.map((article) => (
            <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="grid md:grid-cols-3">
                {article.image_url && (
                  <div className="md:col-span-1 h-48 md:h-full">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={article.image_url ? "md:col-span-2" : "md:col-span-3"}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">{article.title}</CardTitle>
                    <CardDescription className="pt-2">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
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
                    <ContentRenderer 
                      text={article.content} 
                      className="text-muted-foreground" 
                    />
                    {article.link && (
                      <div className="mt-4">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Read More
                          </Button>
                        </a>
                      </div>
                    )}
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
