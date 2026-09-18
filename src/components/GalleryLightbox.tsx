import { useEffect } from "react";
import type { GalleryItem } from "@/lib/content";

export function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(((index as number) + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate(((index as number) - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, items.length, onClose, onNavigate]);

  if (!open) return null;
  const item = items[index as number];
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[60] flex flex-col bg-black/96 p-3 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4 text-off-white">
        <p className="truncate font-serif text-base sm:text-lg">{item.title}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-off-white transition-colors hover:border-gold hover:text-gold"
        >
          <span aria-hidden="true" className="text-lg">
            ✕
          </span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          src={item.image_url}
          alt={item.alt_text ?? item.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate((index! - 1 + items.length) % items.length)}
          className="btn btn-outline-gold"
        >
          Previous
        </button>
        <p className="text-xs uppercase tracking-[0.2em] text-off-white/50">
          {(index as number) + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={() => onNavigate((index! + 1) % items.length)}
          className="btn btn-outline-gold"
        >
          Next
        </button>
      </div>
    </div>
  );
}
