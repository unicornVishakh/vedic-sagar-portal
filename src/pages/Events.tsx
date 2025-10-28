import { useEvents } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Events = () => {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Upcoming Events</h1>
        <p className="text-muted-foreground text-lg">
          Join us for our community gatherings, workshops, and celebrations.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event) => (
            <Card key={event.id} className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              {event.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                  <CardDescription className="pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.start_time).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="relative h-24">
                    <p className="text-muted-foreground line-clamp-4">{event.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link to={`/event/${event.id}`}>
                    <Button className="w-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
