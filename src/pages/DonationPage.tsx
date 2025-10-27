import { useGallery } from "@/hooks/useSupabaseQuery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

const DonationPage = () => {
  const { data: gallery, isLoading: galleryLoading } = useGallery();

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

    </div>
  );
};

export default DonationPage;
