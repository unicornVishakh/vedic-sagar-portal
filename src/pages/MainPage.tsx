import ContentBlock from "@/components/ContentBlock";
import { useContentSections } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import sageImage from "@/assets/sage-meditation.png";

const MainPage = () => {
  const { data: sections, isLoading } = useContentSections();

  const navLinks = [
    { label: 'HOME', href: '/home' },
    { label: 'DONATE', href: '/donation' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <MinimalistHero
        logoText="Veda Vogue"
        navLinks={navLinks}
        mainText="Discover the timeless wisdom of Vedic knowledge. Explore ancient teachings, bhajans, festivals, and spiritual practices that have guided humanity for millennia."
        readMoreLink="#explore"
        imageSrc={sageImage}
        imageAlt="Ancient sage in meditation"
        overlayText={{
          part1: 'Ancient',
          part2: 'Wisdom',
        }}
        socialLinks={socialLinks}
        locationText="Preserving Vedic Heritage"
      />

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
