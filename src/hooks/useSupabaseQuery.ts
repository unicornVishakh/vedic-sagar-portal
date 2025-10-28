import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContentSections = () => {
  return useQuery({
    queryKey: ["content-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_sections")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useBhajans = () => {
  return useQuery({
    queryKey: ["bhajans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bhajans")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useBhajan = (id: string) => {
  return useQuery({
    queryKey: ["bhajan", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bhajans")
        .select("*")
        .eq("bhajan_id", Number(id))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useFestivals = () => {
  return useQuery({
    queryKey: ["festivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festivals")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFestivalMantras = (festivalId: string) => {
  return useQuery({
    queryKey: ["festival-mantras", festivalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festival_mantras")
        .select("*")
        .eq("festival_id", Number(festivalId))
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
    enabled: !!festivalId,
  });
};

export const useStaticPage = (slug: string) => {
  return useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", Number(id))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
