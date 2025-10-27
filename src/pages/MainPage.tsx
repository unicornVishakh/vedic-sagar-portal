import ContentBlock from "@/components/ContentBlock";
import { useContentSections } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/components/ui/banner";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MainPage = () => {
  const { data: sections, isLoading } = useContentSections();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Donation Announcement Banner */}
      {showBanner && (
        <div className="container mx-auto px-2 sm:px-4 pt-4">
          <Banner
            show={showBanner}
            onHide={() => setShowBanner(false)}
            variant="gradient"
            title="Support Our Mission"
            description="Help us preserve and share Vedic knowledge with the world"
            showShade={true}
            closable={true}
            icon={<Heart className="w-5 h-5 text-primary" />}
            className="text-xs sm:text-sm"
            action={
              <Button
                onClick={() => navigate("/donation")}
                size="sm"
                className="gap-1 text-xs sm:text-sm px-2 sm:px-3"
                variant="default"
              >
                Donate Now
                <ArrowRight className="h-3 w-3" />
              </Button>
            }
          />
        </div>
      )}

      {/* Banner */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop"
          alt="Vedic Knowledge Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Explore Vedic Knowledge
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {sections?.map((section) => (
              <ContentBlock key={section.section_id} section={section} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
