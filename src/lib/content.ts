import { supabase } from "@/integrations/supabase/client";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import poster from "@/assets/poster.jpg";
import logo from "@/assets/Logo.png";
import neha from "@/assets/neha.jpg";

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

const assetMap: Record<string, string> = {
  "work-1.jpg": work1,
  "work-1": work1,
  "work-2.jpg": work2,
  "work-2": work2,
  "work-3.jpg": work3,
  "work-3": work3,
  "work-4.jpg": work4,
  "work-4": work4,
  "poster.jpg": poster,
  "poster": poster,
  "logo.png": logo,
  "neha.jpg": neha,
};

const defaultGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Bridal Makeover Session",
    category: "Makeup",
    image_url: work1,
    alt_text: "Makeup, hairstyling and bridal looks created at sNeha's Makeover",
    featured: true,
    display_order: 1,
  },
  {
    id: "2",
    title: "Bridal & Festive Portfolio",
    category: "Makeup",
    image_url: work2,
    alt_text: "Collection of bridal, haldi and party makeup looks by sNeha's Makeover",
    featured: true,
    display_order: 2,
  },
  {
    id: "3",
    title: "Traditional Bridal Look",
    category: "Makeup",
    image_url: work3,
    alt_text: "Bride in a red lehenga with kundan jewellery, styled by sNeha's Makeover",
    featured: true,
    display_order: 3,
  },
  {
    id: "4",
    title: "Nail Art Training Certificate",
    category: "Other",
    image_url: work4,
    alt_text: "Neha Solanki receiving a nail art course completion certificate",
    featured: false,
    display_order: 4,
  },
  {
    id: "5",
    title: "Studio Service Menu",
    category: "Other",
    image_url: poster,
    alt_text: "sNeha's Makeover studio poster listing makeup, skin, hair and nail services",
    featured: false,
    display_order: 5,
  },
];

/**
 * Image URLs are mapped to bundled image assets if they reference local filenames.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  for (const [filename, assetUrl] of Object.entries(assetMap)) {
    if (url.toLowerCase().endsWith(filename)) return assetUrl;
  }
  return url;
}

export const galleryQuery = {
  queryKey: ["gallery"],
  queryFn: async (): Promise<GalleryItem[]> => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id,title,category,image_url,alt_text,featured,display_order")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error || !data || data.length === 0) {
        return defaultGalleryItems;
      }
      return data.map((item) => ({
        ...item,
        image_url: resolveImageUrl(item.image_url),
      })) as GalleryItem[];
    } catch {
      return defaultGalleryItems;
    }
  },
};

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id,name,slug,category,description,price,sale_price,image_url,additional_images,availability,featured",
        )
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error || !data) return [];
      return data.map((product) => ({
        ...product,
        image_url: product.image_url ? resolveImageUrl(product.image_url) : null,
      })) as Product[];
    } catch {
      return [];
    }
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
