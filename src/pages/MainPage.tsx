import ContentBlock from "@/components/ContentBlock";
import { useContentSections } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";

const MainPage = () => {
  const { data: sections, isLoading } = useContentSections();

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop"
          alt="Vedic Knowledge Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
          Explore Vedic Knowledge
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
