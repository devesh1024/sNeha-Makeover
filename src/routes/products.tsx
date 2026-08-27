import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { productsQuery, type Product } from "@/lib/content";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { whatsappLink } from "@/config/site";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Product Catalogue | sNeha's Makeover" },
      {
        name: "description",
        content:
          "Browse hair care, skin care, makeup and nail care products available at sNeha's Makeover studio.",
      },
      { property: "og:title", content: "Product Catalogue | sNeha's Makeover" },
      {
        property: "og:description",
        content: "Beauty products available at sNeha's Makeover — browse and inquire.",
      },
    ],
  }),
  component: ProductsPage,
});

const CATEGORIES = [
  "All",
  "Hair Care",
  "Skin Care",
  "Makeup",
  "Nail Care",
  "Beauty Accessories",
  "Other",
];

function ProductDetails({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const images = [product.image_url, ...(product.additional_images ?? [])].filter(Boolean) as string[];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto bg-card">
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="bg-muted">
            {images[0] ? (
              <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Image coming soon
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <p className="eyebrow text-gold-muted">{product.category}</p>
            <h2 className="mt-3 text-2xl">{product.name}</h2>
            <div className="mt-4 h-px w-12 bg-gold" aria-hidden="true" />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description ?? "Details available on request."}
            </p>
            <p className="mt-6 text-lg">
              {product.sale_price != null
                ? `₹${Number(product.sale_price).toLocaleString("en-IN")}`
                : product.price != null
                  ? `₹${Number(product.price).toLocaleString("en-IN")}`
                  : "Contact us for price"}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {product.availability}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={whatsappLink(
                  `Hi, I would like to know more about "${product.name}" available at sNeha's Makeover.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
              >
                Inquire on WhatsApp
              </a>
              <button type="button" onClick={onClose} className="btn btn-outline-dark">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  const { data, isLoading } = useQuery(productsQuery);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .filter((p) => filter === "All" || p.category === filter)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
  }, [data, filter, query]);

  const empty = !isLoading && (data ?? []).length === 0;

  return (
    <>
      <section className="bg-black px-5 pb-16 pt-32 text-off-white sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Catalogue"
            tone="dark"
            title="Products"
            description="Discover beauty products available at sNeha's Makeover. Found something you like? Send us an inquiry and we will confirm availability."
          />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {empty ? (
            <div className="border border-border bg-card px-6 py-24 text-center">
              <p className="eyebrow text-gold">Coming soon</p>
              <h2 className="mt-5 text-3xl">Product catalogue coming soon</h2>
              <div className="mx-auto mt-5 h-px w-14 bg-gold" aria-hidden="true" />
              <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
                We are putting the catalogue together. In the meantime, reach out and we will tell you
                what is currently available at the studio.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn btn-dark">
                  Contact Us
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full lg:max-w-sm">
                  <label htmlFor="product-search" className="sr-only">
                    Search products
                  </label>
                  <input
                    id="product-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
                  />
                </div>
                <FilterBar
                  options={CATEGORIES}
                  value={filter}
                  onChange={setFilter}
                  label="Filter products"
                />
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading products…</p>
                ) : products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No products match your search right now.
                  </p>
                ) : (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} onView={setActive} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {active ? <ProductDetails product={active} onClose={() => setActive(null)} /> : null}

      <CTASection title="Looking for something specific?" />
    </>
  );
}
