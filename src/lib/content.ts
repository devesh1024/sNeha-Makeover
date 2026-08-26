import { supabase } from "@/integrations/supabase/client";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  alt_text: string | null;
  featured: boolean;
  display_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  image_url: string | null;
  additional_images: string[];
  availability: string;
  featured: boolean;
};

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  inquiry_type: string;
  service_or_product?: string;
  preferred_date?: string | null;
  message?: string;
};

/**
 * Image URLs are stored as plain strings, so the source (Cloud storage, CDN,
 * Drive, anything else) stays abstracted away from the UI.
 */
export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return "";
  return url;
}

export const galleryQuery = {
  queryKey: ["gallery"],
  queryFn: async (): Promise<GalleryItem[]> => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id,title,category,image_url,alt_text,featured,display_order")
      .eq("published", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as GalleryItem[];
  },
};

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,slug,category,description,price,sale_price,image_url,additional_images,availability,featured",
      )
      .eq("published", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
};

export async function submitInquiry(input: InquiryInput) {
  const { error } = await supabase.from("inquiries").insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    inquiry_type: input.inquiry_type,
    service_or_product: input.service_or_product || null,
    preferred_date: input.preferred_date || null,
    message: input.message || null,
  });
  if (error) throw error;
}
