import { useState } from "react";
import { useGallery } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
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
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert([{
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
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
    <div className="container mx-auto px-4 py-8">
      {/* Donation Section */}
      <section id="donate" className="mb-16">
        <div className="flex flex-col items-center justify-center gap-4 mb-12 px-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center">Support Our Mission</h1>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8 mt-8">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center text-foreground/90">
              Your generous contributions empower us to preserve ancient Vedic wisdom, develop cutting-edge digital platforms, 
              and strengthen our community for generations to come.
            </p>
            
            <div className="space-y-6 px-4 sm:px-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-primary">Our Vision for the Future</h2>
              </div>
              
              <div className="grid gap-4 sm:gap-6 text-left">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
                    Expand our digital library with comprehensive collections of Vedic Rituals, sacred texts, and ancient scriptures, 
                    making timeless knowledge accessible to seekers worldwide.
                  </p>
                </div>
                
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
                    Establish a dedicated marketplace offering authentic havan samagri, religious books, and spiritual accessories, 
                    ensuring quality and convenience for your religious practices.
                  </p>
                </div>
                
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
                    Create a comprehensive platform serving as your complete resource for pujas, havans, spiritual guidance, 
                    and Vedic knowledge—all in one place.
                  </p>
                </div>
                
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary mt-2"></div>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
                    Develop innovative services including community event management, convenient doorstep pandit services, 
                    and modern payment solutions like Vedic Pay—bringing traditional values into the digital age.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center py-6">
              <p className="text-base sm:text-lg md:text-xl font-medium text-primary mb-8 px-4">
                Join us in building a stronger, more connected Vedic community—united in preserving our heritage 
                and embracing the future.
              </p>

              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                onClick={() => window.location.href = '/donate-form'}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>
        </div>

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
      <section id="contact" className="scroll-mt-20 py-16">
        <div className="container">
          <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
            <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
              <div className="text-center lg:text-left">
                <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl text-primary">
                  Contact Us
                </h1>
                <p className="text-muted-foreground">
                  We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!
                </p>
              </div>
              <div className="mx-auto w-fit lg:mx-0">
                <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                  Contact Details
                </h3>
                <ul className="ml-4 list-disc space-y-2">
                  <li>
                    <span className="font-bold">Phone: </span>
                    +91 XXXXX XXXXX
                  </li>
                  <li>
                    <span className="font-bold">Email: </span>
                    <a href="mailto:contact@aryasamaj.org" className="underline">
                      contact@aryasamaj.org
                    </a>
                  </li>
                  <li>
                    <span className="font-bold">Purpose: </span>
                    Advertisements, suggestions, improvements, and contributions
                  </li>
                </ul>
              </div>
            </div>
            <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10 bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      type="text"
                      id="firstname"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      type="text"
                      id="lastname"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    placeholder="Type your message here."
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonationPage;
