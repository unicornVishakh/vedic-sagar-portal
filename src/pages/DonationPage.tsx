import { useState } from "react";
import { useGallery } from "@/hooks/useSupabaseQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const DonationPage = () => {
  const { data: gallery, isLoading: galleryLoading } = useGallery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert([formData]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Donation Section */}
      <section className="mb-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Support Our Mission</h1>
        </div>

        <Card className="max-w-4xl mx-auto mb-12">
          <CardContent className="p-8 text-center">
            <p className="text-lg mb-6">
              Your generous donations help us preserve and spread Vedic knowledge, organize community
              events, and maintain this digital platform for seekers of truth.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
          </CardContent>
        </Card>

        {/* Gallery */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Our Work</h2>
          {galleryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery?.map((photo) => (
                <div key={photo.photo_id} className="group relative overflow-hidden rounded-lg">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Gallery image"}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Send className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Reach Out To Us</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Get in Touch</CardTitle>
            <p className="text-center text-muted-foreground">
              We'd love to hear from you. Please share your thoughts, questions, or how you'd like
              to contribute to our mission.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DonationPage;
