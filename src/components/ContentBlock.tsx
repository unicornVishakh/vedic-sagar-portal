import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Music, Calendar, Flame } from "lucide-react";

interface ContentBlockProps {
  section: {
    section_id: number;
    title: string;
    slug: string;
    description: string | null;
    content_type: string;
    link_key: string | null;
  };
}

const getIcon = (contentType: string) => {
  switch (contentType) {
    case "BHAJAN_LIST":
      return <Music className="w-8 h-8" />;
    case "TYOHAR_LIST":
      return <Calendar className="w-8 h-8" />;
    case "STATIC_PAGE":
      return <Flame className="w-8 h-8" />;
    default:
      return <BookOpen className="w-8 h-8" />;
  }
};

const getLink = (section: ContentBlockProps["section"]) => {
  switch (section.content_type) {
    case "BHAJAN_LIST":
      return "/bhajans";
    case "TYOHAR_LIST":
      return "/festivals";
    case "STATIC_PAGE":
      return `/page/${section.link_key}`;
    default:
      return "/home";
  }
};

const ContentBlock = ({ section }: ContentBlockProps) => {
  return (
    <Link to={getLink(section)}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-card h-full">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[200px]">
          <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
            {getIcon(section.content_type)}
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">{section.title}</h3>
          {section.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentBlock;
