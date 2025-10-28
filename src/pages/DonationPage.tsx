import { useGallery } from "@/hooks/useSupabaseQuery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { InputWithFeedback } from "@/components/ui/input-with-feedback";
import { useState } from "react";

const DonationPage = () => {
  const { data: gallery, isLoading: galleryLoading } = useGallery();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Donation Section */}
      <section id="donate" className="mb-20">
        <div className="flex flex-col items-center justify-center gap-6 mb-16">
          <div className="flex items-center gap-3">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary text-center">Build the Future of Dharma, Today.</h1>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-10">
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-center text-foreground/90 font-light">
              Our heritage is timeless, but the way we share it must evolve. Your contribution fuels the innovation needed to build world-class digital platforms, ensuring Vedic wisdom not only survives but thrives in the modern world.
            </p>
            
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-primary">What We're Building Next</h2>
              </div>
              
              <div className="grid gap-6 sm:gap-8 text-left max-w-4xl mx-auto">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">The Digital Ashram</h3>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                      An ever-growing library of sacred texts and rituals, open to anyone, anywhere in the world.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">The Devotee's Marketplace</h3>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                      A curated source for authentic spiritual goods—from havan samagri to rare books—delivered with modern convenience.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">The Complete Spiritual Resource</h3>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                      One platform to connect you with pujas, havans, and the deep Vedic knowledge you seek.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">Services for Modern Life</h3>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                      We're innovating with on-demand pandit services, event management tools, and secure payment solutions to make practicing our traditions easier than ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-8">

              <Button 
                size="lg" 
                className="text-lg px-10 py-7 h-auto"
                onClick={() => window.location.href = '/donate-form'}
              >
                <Heart className="w-6 h-6 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>
        </div>

      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 border-t">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Contact Us</h2>
            <p className="text-lg sm:text-xl text-foreground/80 font-light">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-foreground/80">contact@vedicknowledge.org</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-foreground/80">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Address</h3>
                  <p className="text-foreground/80">
                    123 Vedic Way<br />
                    Sacred City, SC 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <InputWithFeedback
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <InputWithFeedback
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  placeholder="Your message..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DonationPage;
