import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/content";

export const BUCKET = "site-media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export type Offer = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  active: boolean;
  created_at: string;
};

export const offersQuery = {
  queryKey: ["offers"],
  queryFn: async (): Promise<Offer[]> => {
    const { data, error } = await supabase
      .from("offers")
      .select("id,title,image_url,link_url,active,created_at")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Offer[];
  },
};

export const adminOffersQuery = {
  queryKey: ["admin", "offers"],
  queryFn: async (): Promise<Offer[]> => {
    const { data, error } = await supabase
      .from("offers")
      .select("id,title,image_url,link_url,active,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Offer[];
  },
};

export const adminGalleryQuery = {
  queryKey: ["admin", "gallery"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id,title,category,image_url,alt_text,featured,display_order,published,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

export type AdminProduct = Product & { published: boolean; display_order: number };

export const adminProductsQuery = {
  queryKey: ["admin", "products"],
  queryFn: async (): Promise<AdminProduct[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,slug,category,description,price,sale_price,image_url,additional_images,availability,featured,published,display_order",
      )
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as AdminProduct[];
  },
};

function extension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "jpg";
}

/**
 * The media bucket is private, so uploads are served through a long-lived
 * signed URL that can be dropped straight into an <img src>.
 */
export async function uploadImage(folder: string, file: File) {
  const path = `${folder}/${crypto.randomUUID()}.${extension(file)}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Could not create image URL");

  return { path, url: data.signedUrl };
}

export function storagePathFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = `/object/sign/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]!);
}

export async function removeStoredImage(url: string | null | undefined) {
  const path = storagePathFromUrl(url);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
