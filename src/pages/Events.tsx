import { useEvents } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { FollowerPointerCard } from "@/components/ui/follower-pointer";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Events = () => {
  const { data: events, isLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

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
            <FollowerPointerCard key={event.id} title={event.title}>
              <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                  <CardDescription className="pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.start_time).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-24">
                    <p className="text-muted-foreground line-clamp-4">{event.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <Button onClick={() => setSelectedEvent(event)} className="mt-4 w-full">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </FollowerPointerCard>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-card rounded-lg shadow-2xl max-w-2xl w-full relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="w-6 h-6" />
              </Button>
              {selectedEvent.image_url && (
                <div className="h-64 overflow-hidden rounded-t-lg">
                  <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-primary mb-4">{selectedEvent.title}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedEvent.start_time).toLocaleDateString()}
                      {selectedEvent.end_time && ` - ${new Date(selectedEvent.end_time).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedEvent.start_time).toLocaleTimeString()}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-foreground/80 leading-relaxed">{selectedEvent.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
