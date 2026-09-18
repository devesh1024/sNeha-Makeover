/**
 * Static gallery items backed by local asset images.
 * These are used as the primary/fallback source so images are always
 * visible even when no rows exist in the Supabase gallery_items table.
 */
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import type { GalleryItem } from "@/lib/content";

export const staticGalleryItems: GalleryItem[] = [
  {
    id: "static-1",
    title: "Bridal Makeup",
    category: "Makeup",
    image_url: work1,
    alt_text: "Full bridal makeup look created at sNeha's Makeover studio",
    featured: true,
    display_order: 1,
  },
  {
    id: "static-2",
    title: "Hairstyling",
    category: "Hair",
    image_url: work2,
    alt_text: "Elegant hairstyling session at sNeha's Makeover",
    featured: true,
    display_order: 2,
  },
  {
    id: "static-3",
    title: "Party Look",
    category: "Makeup",
    image_url: work3,
    alt_text: "Glamorous party makeup look by sNeha's Makeover",
    featured: true,
    display_order: 3,
  },
  {
    id: "static-4",
    title: "Nail Art",
    category: "Nails",
    image_url: work4,
    alt_text: "Creative nail art and gel extension work at sNeha's Makeover",
    featured: false,
    display_order: 4,
  },
];
