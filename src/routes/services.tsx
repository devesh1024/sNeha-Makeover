import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { serviceCategories, formatPrice } from "@/data/services";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { FilterBar } from "@/components/FilterBar";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Prices | sNeha's Makeover" },
      {
        name: "description",
        content:
          "Makeup, hair care, skin care, nail enhancement and waxing services at sNeha's Makeover, with starting prices for each treatment.",
      },
      { property: "og:title", content: "Services & Prices | sNeha's Makeover" },
      {
        property: "og:description",
        content: "Makeup, hair, skin, nails and waxing services with starting prices.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [openCategory, setOpenCategory] = useState<string | null>(
    serviceCategories[0]?.slug ?? null,
  );

  const filters = ["All", ...serviceCategories.map((c) => c.short)];

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return serviceCategories
      .filter((c) => filter === "All" || c.short === filter)
      .map((c) => ({
        ...c,
        groups: c.groups
          .map((g) => ({
            ...g,
            items: q
              ? g.items.filter(
                  (i) =>
                    i.name.toLowerCase().includes(q) ||
                    g.title.toLowerCase().includes(q) ||
                    c.title.toLowerCase().includes(q),
                )
              : g.items,
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((c) => c.groups.length > 0);
  }, [query, filter]);

  const searching = query.trim().length > 0;

  return (
    <>
      <section className="bg-black px-5 pb-16 pt-32 text-off-white sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Menu"
            tone="dark"
            title="Services & Prices"
            description="Our complete service menu. Prices marked “Starting From” vary with hair length, product choice and the look you have in mind."
          />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-sm">
              <label htmlFor="service-search" className="sr-only">
                Search services
              </label>
              <input
                id="service-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services…"
                className="w-full border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
              />
            </div>
            <FilterBar options={filters} value={filter} onChange={setFilter} label="Filter services" />
          </div>

          <div className="mt-12 space-y-4">
            {categories.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No services match your search. Try another term or{" "}
                <Link to="/contact" className="text-gold-dark underline">
                  contact us
                </Link>
                .
              </p>
            ) : null}

            {categories.map((category, index) => {
              const expanded = searching || openCategory === category.slug;
              return (
                <Reveal key={category.slug} delay={index * 60}>
                  <article id={category.slug} className="border border-border bg-card scroll-mt-28">
                    <h2>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCategory((prev) => (prev === category.slug ? null : category.slug))
                        }
                        aria-expanded={expanded}
                        aria-controls={`panel-${category.slug}`}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-6 text-left sm:px-8"
                      >
                        <span className="min-w-0">
                          <span className="eyebrow block text-gold-muted">{category.short}</span>
                          <span className="mt-3 block font-serif text-2xl sm:text-3xl">
                            {category.title}
                          </span>
                          <span className="mt-2 block text-sm text-muted-foreground">
                            {category.description}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`grid h-11 w-11 shrink-0 place-items-center border border-gold/40 text-gold-dark transition-transform duration-500 ${
                            expanded ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                    </h2>

                    {expanded ? (
                      <div
                        id={`panel-${category.slug}`}
                        className="border-t border-border px-5 pb-8 pt-6 sm:px-8"
                      >
                        <div className="grid gap-10 md:grid-cols-2">
                          {category.groups.map((group) => (
                            <div key={group.title}>
                              <h3 className="eyebrow text-foreground">{group.title}</h3>
                              <div className="mt-3 h-px w-10 bg-gold" aria-hidden="true" />
                              <ul className="mt-5 space-y-4">
                                {group.items.map((item) => (
                                  <li
                                    key={item.name}
                                    className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4"
                                  >
                                    <span className="min-w-0">
                                      <span className="block text-sm text-foreground">{item.name}</span>
                                      {item.note ? (
                                        <span className="block text-xs text-muted-foreground">
                                          {item.note}
                                        </span>
                                      ) : null}
                                    </span>
                                    <span className="shrink-0 text-right">
                                      {item.startingFrom ? (
                                        <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                                          Starting From
                                        </span>
                                      ) : null}
                                      <span className="block text-sm font-medium text-foreground">
                                        {formatPrice(item.price)}
                                      </span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            Interested in a service?{" "}
            <Link to="/contact" className="text-gold-dark underline underline-offset-4">
              Contact us
            </Link>{" "}
            and we will guide you.
          </p>
        </div>
      </section>

      <CTASection title="Book your appointment" />
    </>
  );
}
