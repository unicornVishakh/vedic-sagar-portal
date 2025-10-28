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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary text-center">Support Our Mission</h1>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-10">
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-center text-foreground/90 font-light">
              Your generous contributions empower us to preserve ancient Vedic wisdom, develop cutting-edge digital platforms, 
              and strengthen our community for generations to come.
            </p>
            
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-primary">Our Vision for the Future</h2>
              </div>
              
              <div className="grid gap-6 sm:gap-8 text-left max-w-4xl mx-auto">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                    Expand our digital library with comprehensive collections of Vedic Rituals, sacred texts, and ancient scriptures, 
                    making timeless knowledge accessible to seekers worldwide.
                  </p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                    Establish a dedicated marketplace offering authentic havan samagri, religious books, and spiritual accessories, 
                    ensuring quality and convenience for your religious practices.
                  </p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                    Create a comprehensive platform serving as your complete resource for pujas, havans, spiritual guidance, 
                    and Vedic knowledge—all in one place.
                  </p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2"></div>
                  <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
                    Develop innovative services including community event management, convenient doorstep pandit services, 
                    and modern payment solutions like Vedic Pay—bringing traditional values into the digital age.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <p className="text-lg sm:text-xl md:text-2xl font-light text-foreground/90 mb-10 px-4">
                Join us in building a stronger, more connected Vedic community—united in preserving our heritage 
                and embracing the future.
              </p>

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

        {/* Gallery */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Work</h2>
          {galleryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery?.map((photo) => (
                <div key={photo.photo_id} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Gallery image"}
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white text-base font-light">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
