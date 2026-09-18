import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { offersQuery } from "@/lib/admin";

const SESSION_KEY = "snm-offer-seen";

/**
 * Shown once per browser session over a blurred view of the page behind it.
 */
export function OfferPopup() {
  const { data } = useQuery({ ...offersQuery, staleTime: 5 * 60 * 1000 });
  const offer = data?.[0];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!offer) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY) === offer.id) return;
    const t = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(t);
  }, [offer]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    if (offer) window.sessionStorage.setItem(SESSION_KEY, offer.id);
    setOpen(false);
  }

  if (!offer || !open) return null;

  const image = (
    <img
      src={offer.image_url}
      alt={offer.title}
      className="max-h-[80vh] w-full object-contain"
    />
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={offer.title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close offer"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-md"
      />
      <div className="relative w-full max-w-sm animate-[offer-in_500ms_ease-out] border border-gold/60 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-black text-lg text-gold transition-colors hover:bg-gold hover:text-black"
        >
          ×
        </button>
        {offer.link_url ? (
          <a href={offer.link_url} target="_blank" rel="noopener noreferrer" onClick={close}>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  );
}
