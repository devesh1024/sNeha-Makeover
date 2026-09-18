import { useState } from "react";
import type { GalleryItem } from "@/lib/content";
import { GalleryLightbox } from "./GalleryLightbox";

/**
 * Masonry columns preserve each photograph's natural aspect ratio — portrait
 * images stay tall, landscape images stay wide, nothing is stretched.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Photographs are being added to this collection.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden border border-transparent bg-muted transition-colors duration-500 hover:border-gold/50"
            aria-label={`Open ${item.title}`}
          >
            <img
              src={item.image_url}
              alt={item.alt_text ?? item.title}
              loading="lazy"
              decoding="async"
              className="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="text-left text-xs uppercase tracking-[0.18em] text-off-white">
                {item.category}
              </span>
            </span>
          </button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </>
  );
}
