import React from 'react';

// Regex to find URLs (http, https, www)
const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

// Regex to find YouTube video IDs
const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

interface ContentRendererProps {
  text: string;
  className?: string;
}

/**
 * A component that renders text content, automatically parsing for:
 * 1. YouTube links (embeds them)
 * 2. Other URLs (makes them clickable)
 * 3. Newlines (converts them to <br> tags)
 */
const ContentRenderer: React.FC<ContentRendererProps> = ({ text, className }) => {
  if (!text) return null;

  // Split text by newlines to preserve them as <br> tags
  const parts = text.split(/(\n)/);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part === '\n') {
          return <br key={index} />;
        }

        // Check for YouTube link
        const youtubeMatch = part.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
          const videoId = youtubeMatch[1];
          return (
            <div key={index} className="relative overflow-hidden shadow-lg rounded-lg my-4" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
              />
            </div>
          );
        }

        // Check for general links
        const linkParts = part.split(urlRegex);

        return linkParts.map((linkPart, i) => {
          if (linkPart && (linkPart.match(urlRegex))) {
            let fullUrl = linkPart;
            if (linkPart.startsWith('www.')) {
              fullUrl = `https://` + linkPart;
            }
            return (
              <a
                key={i}
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 break-words"
              >
                {linkPart}
              </a>
            );
          }
          // Render plain text segment
          return <React.Fragment key={i}>{linkPart}</React.Fragment>;
        });
      })}
    </div>
  );
};

export default ContentRenderer;
