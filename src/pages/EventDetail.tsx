import { useParams, Link } from "react-router-dom";
import { useEvent } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Event not found</p>
        <Link to="/events">
          <Button className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-6">
        <Link to="/events">
          <Button variant="ghost" className="mb-4 hover:bg-accent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {event.image_url && (
          <div className="relative h-[400px] overflow-hidden rounded-2xl mb-8 shadow-2xl">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        )}
        
        <div className="space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap gap-6 p-4 bg-accent/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {new Date(event.start_time).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {event.end_time && ` - ${new Date(event.end_time).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {new Date(event.start_time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">{event.location}</span>
              </div>
            )}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
