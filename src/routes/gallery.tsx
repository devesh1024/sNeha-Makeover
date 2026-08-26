import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { galleryQuery } from "@/lib/content";
import { GalleryGrid } from "@/components/GalleryGrid";
import { FilterBar } from "@/components/FilterBar";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | sNeha's Makeover — Makeup, Hair & Nail Portfolio" },
      {
        name: "description",
        content:
          "Browse real bridal makeup, party looks, hairstyling and nail work created at sNeha's Makeover studio.",
      },
      { property: "og:title", content: "Gallery | sNeha's Makeover" },
      {
        property: "og:description",
        content: "Real bridal makeup, hairstyling and nail work by sNeha's Makeover.",
      },
    ],
  }),
  component: GalleryPage,
});

const FILTERS = ["All", "Makeup", "Hair", "Nails", "Other"];

function GalleryPage() {
  const { data, isLoading } = useQuery(galleryQuery);
  const [filter, setFilter] = useState("All");

  const items = useMemo(() => {
    const all = data ?? [];
    return filter === "All" ? all : all.filter((i) => i.category === filter);
  }, [data, filter]);

  return (
    <>
      <section className="bg-black px-5 pb-16 pt-32 text-off-white sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Portfolio"
            tone="dark"
            title="Our Work"
            description="A curated look at makeup, hairstyling and nail work created at the studio. Every photograph here is real client work."
          />
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FilterBar options={FILTERS} value={filter} onChange={setFilter} label="Filter gallery" />
          <div className="mt-10">
            {isLoading ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Loading gallery…</p>
            ) : (
              <GalleryGrid items={items} />
            )}
          </div>
        </div>
      </section>

      <CTASection title="Like what you see?" />
    </>
  );
}
