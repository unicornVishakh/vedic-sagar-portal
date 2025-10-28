import { useParams, Link } from "react-router-dom";
import { useEvent } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import ContentRenderer from "@/lib/content-parser";

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link to="/events">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {event.image_url && (
          <div className="h-96 overflow-hidden rounded-lg mb-8 shadow-lg">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold text-primary mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.start_time).toLocaleDateString()}
              {event.end_time && ` - ${new Date(event.end_time).toLocaleDateString()}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(event.start_time).toLocaleTimeString()}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        {/* Use the new ContentRenderer component */}
        <ContentRenderer 
          text={event.description} 
          className="text-foreground/80 leading-relaxed" 
        />
      </div>
    </div>
  );
};

export default EventDetail;
