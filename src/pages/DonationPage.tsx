import { useState } from "react";
import { useGallery } from "@/hooks/useSupabaseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/components/ui/banner";
import { Heart, Send, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const DonationPage = () => {
  const { data: gallery, isLoading: galleryLoading } = useGallery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
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
      {/* Announcement Banner */}
      <div className="mb-8">
        <Banner
          show={showBanner}
          onHide={() => setShowBanner(false)}
          variant="gradient"
          size="lg"
          title="Support Vedic Knowledge & Culture"
          description="Your donations help preserve ancient wisdom and build modern solutions for the community"
          showShade={true}
          closable={true}
          icon={<Sparkles className="w-6 h-6 text-primary" />}
          action={
            <Button
              onClick={() => {
                const donateSection = document.getElementById('donate');
                donateSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
              size="sm"
            >
              Donate Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />
      </div>

      {/* Donation Section */}
      <section id="donate" className="mb-16 scroll-mt-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Support Our Mission</h1>
        </div>

        <Card className="max-w-4xl mx-auto mb-12">
          <CardContent className="p-8">
            <div className="space-y-6 text-center">
              <p className="text-lg leading-relaxed">
                Your generous donations help us preserve and spread Vedic knowledge, organize community
                events, and maintain this digital platform for seekers of truth.
              </p>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">Our Vision</h3>
                <div className="text-left space-y-3 text-muted-foreground">
                  <p>Going forward, we would add various other Vedic Rituals, Vedas, and other books to the app.</p>
                  <p>Provide a store for people to easily buy havan samagri and religious books.</p>
                  <p>Making it a one-stop app for all puja, havan needs, resources, and knowledge.</p>
                  <p>And add more functionalities like community events, doorstep pandit services, and creating our own payment systems like Vedic Pay, which everyone can use to make payments just like Google Pay.</p>
                </div>
              </div>

              <p className="text-lg font-medium text-primary">
                Please join us in our initiative to make our Vedic community more stronger and organized like never before.
              </p>

              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </Button>
            </div>
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
