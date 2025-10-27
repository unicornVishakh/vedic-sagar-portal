import { useId, useRef, useState, useEffect } from "react";
import { useBhajans } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useNavigate } from "react-router-dom";

const BhajanList = () => {
  const { data: bhajans, isLoading } = useBhajans();
  const [active, setActive] = useState<any | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleViewFull = (bhajanId: number) => {
    setActive(null);
    navigate(`/bhajan/${bhajanId}`);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.bhajan_id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 z-[110]"
              onClick={() => setActive(null)}
            >
              <X className="h-4 w-4 text-black" />
            </motion.button>

            <motion.div
              layoutId={`card-${active.bhajan_id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border shadow-lg"
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b p-8">
                <motion.div
                  layoutId={`icon-${active.bhajan_id}-${id}`}
                  className="flex justify-center mb-4"
                >
                  <Music className="w-12 h-12 text-primary" />
                </motion.div>
                <motion.h3
                  layoutId={`title-${active.bhajan_id}-${id}`}
                  className="font-bold text-xl text-center"
                >
                  {active.title}
                </motion.h3>
                {active.author && (
                  <motion.p
                    layoutId={`author-${active.bhajan_id}-${id}`}
                    className="text-center text-muted-foreground mt-2"
                  >
                    by {active.author}
                  </motion.p>
                )}
              </div>

              <div className="pt-4 relative px-4 flex-1">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm h-40 md:h-fit pb-4 flex flex-col gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {active.lyrics}
                  </pre>
                </motion.div>
              </div>

              <div className="p-4 border-t">
                <motion.button
                  onClick={() => handleViewFull(active.bhajan_id)}
                  className="w-full px-4 py-3 text-sm rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  View Full & Play Audio
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Bhajan Kosh</h1>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <ul className="max-w-4xl mx-auto w-full space-y-3">
            {bhajans?.map((bhajan) => (
              <motion.div
                layoutId={`card-${bhajan.bhajan_id}-${id}`}
                key={`card-${bhajan.bhajan_id}-${id}`}
                onClick={() => setActive(bhajan)}
                className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-accent/50 hover:border-primary/50 rounded-xl cursor-pointer border bg-card transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex gap-4 flex-col md:flex-row items-center w-full">
                  <motion.div
                    layoutId={`icon-${bhajan.bhajan_id}-${id}`}
                    className="flex-shrink-0"
                  >
                    <Music className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="flex-1 text-center md:text-left">
                    <motion.h3
                      layoutId={`title-${bhajan.bhajan_id}-${id}`}
                      className="font-medium text-base"
                    >
                      {bhajan.title}
                    </motion.h3>
                    {bhajan.author && (
                      <motion.p
                        layoutId={`author-${bhajan.bhajan_id}-${id}`}
                        className="text-sm text-muted-foreground"
                      >
                        by {bhajan.author}
                      </motion.p>
                    )}
                  </div>
                  <motion.button
                    className="px-4 py-2 text-sm rounded-full font-bold bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-colors mt-4 md:mt-0"
                  >
                    View Lyrics
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default BhajanList;
