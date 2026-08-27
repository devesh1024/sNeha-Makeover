import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import heroBg from "@/assets/hero-bg.jpg";
import neha from "@/assets/neha.jpg";
import { siteConfig, whatsappLink } from "@/config/site";
import { serviceCategories, featuredServices, formatPrice } from "@/data/services";
import { galleryQuery, productsQuery } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "sNeha's Makeover | Beauty, Makeup, Hair, Nails & Skin Care" },
      {
        name: "description",
        content:
          "sNeha's Makeover is a personal beauty and makeover studio for makeup, hair, nails and skin care. Khud Se Milo – Naye Look Ke Saath.",
      },
      { property: "og:title", content: "sNeha's Makeover | Beauty, Makeup, Hair, Nails & Skin Care" },
      {
        property: "og:description",
        content: "Makeup, Hair, Nails & Skin Care crafted to bring out your best look.",
      },
    ],
  }),
  component: HomePage,
});

const whyChooseUs = [
  {
    title: "A personal beauty experience",
    body: "One-to-one attention in a calm studio setting, with looks shaped around you rather than a fixed template.",
  },
  {
    title: "Makeup & makeover expertise",
    body: "From party looks to full bridal makeovers, styled to suit your outfit, features and the occasion.",
  },
  {
    title: "Hair, nails & skin care",
    body: "Cuts, treatments, colour, facials, gel finishes and extensions — all under one roof.",
  },
  {
    title: "Attention to detail",
    body: "Careful prep, clean finishing and looks that hold up through long celebrations.",
  },
];

function HomePage() {
  const { data: gallery } = useQuery(galleryQuery);
  const { data: products } = useQuery(productsQuery);

  const featuredGallery = (gallery ?? []).slice(0, 5);
  const featuredProducts = (products ?? []).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-black px-5 pb-20 pt-32 sm:px-8">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-2xl text-off-white">
            <p className="eyebrow text-gold">Beauty Studio · {siteConfig.note}</p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              sNeha&apos;s <span className="block gold-text">Makeover</span>
            </h1>
            <p className="mt-6 font-serif text-xl italic text-gold-light sm:text-2xl">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 h-px w-24 bg-gold" aria-hidden="true" />
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-off-white/75 sm:text-base">
              {siteConfig.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/services" className="btn btn-gold">
                Explore Services
              </Link>
              <Link to="/gallery" className="btn btn-outline-gold">
                View Our Work
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-gold"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Brand introduction */}
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
          <Reveal className="relative">
            <div
              className="absolute -left-4 -top-4 hidden h-full w-full border border-gold/50 sm:block"
              aria-hidden="true"
            />
            <img
              src={neha}
              alt="Neha, the beautician behind sNeha's Makeover"
              loading="lazy"
              className="relative w-full object-cover shadow-[var(--shadow-soft)]"
            />
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              eyebrow="Meet the artist"
              title={
                <>
                  A personal beauty and
                  <br />
                  makeover studio
                </>
              }
              description="sNeha's Makeover is a boutique studio built around one idea — that a good look should feel like you, only more so. Every appointment starts with a conversation about the occasion, your outfit and what you feel comfortable wearing on your skin."
            />
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Makeup, hairstyling, nails and skin care are all done in-studio, so a full look can be
              completed in one sitting.
            </p>
            <p className="mt-6 font-serif text-lg italic text-gold-dark">{siteConfig.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/gallery" className="btn btn-dark">
                See the Work
              </Link>
              <Link to="/contact" className="btn btn-outline-dark">
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-black px-5 py-20 text-off-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What we do"
            tone="dark"
            title="Services"
            description="Five service families, one studio. Every category has its own detailed menu with starting prices."
          />
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 70}>
                <Link
                  to="/services"
                  hash={category.slug}
                  className="group flex h-full flex-col justify-between bg-black p-7 transition-colors duration-500 hover:bg-near-black"
                >
                  <div>
                    <span className="eyebrow text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 font-serif text-2xl text-off-white">{category.short}</h3>
                    <p className="mt-3 text-sm text-off-white/60">{category.title}</p>
                  </div>
                  <span className="mt-10 inline-block text-xs uppercase tracking-[0.18em] text-gold transition-transform duration-500 group-hover:translate-x-1">
                    View menu →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured work"
            description="Real client work — bridal makeovers, festive looks, hairstyling and nail art photographed at the studio."
          />
          {featuredGallery.length > 0 ? (
            <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {featuredGallery.map((item, i) => (
                <Reveal key={item.id} delay={i * 60}>
                  <Link
                    to="/gallery"
                    className="group block overflow-hidden break-inside-avoid border border-transparent transition-colors duration-500 hover:border-gold/50"
                  >
                    <img
                      src={item.image_url}
                      alt={item.alt_text ?? item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-muted-foreground">
              Portfolio photographs will appear here as they are added.
            </p>
          )}
          <div className="mt-12">
            <Link to="/gallery" className="btn btn-outline-dark">
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-border bg-off-white px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Why sNeha's Makeover" title="What to expect" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-px w-10 bg-gold" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Price highlights */}
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Popular"
            title="Featured services"
            description="A few of the most requested treatments. The full menu with every category and price is on the services page."
          >
            <Link to="/services" className="btn btn-dark mt-8">
              View Full Menu
            </Link>
          </SectionHeading>

          <ul className="divide-y divide-border border-y border-border">
            {featuredServices.map((service, i) => (
              <Reveal as="li" key={service.name} delay={i * 50}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5">
                  <div className="min-w-0">
                    <p className="eyebrow text-gold-muted">{service.category}</p>
                    <p className="mt-2 font-serif text-xl">{service.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Starting From
                    </p>
                    <p className="text-lg">{formatPrice(service.price)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Product catalogue preview */}
      <section className="bg-near-black px-5 py-20 text-off-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Catalogue"
            tone="dark"
            title="Products at the studio"
            description="Discover beauty products available at sNeha's Makeover."
          />
          {featuredProducts.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onView={() => {}} />
              ))}
            </div>
          ) : (
            <p className="mt-8 max-w-xl text-sm text-off-white/60">
              The product catalogue is being prepared. Reach out and we will tell you what is
              currently available at the studio.
            </p>
          )}
          <div className="mt-12">
            <Link to="/products" className="btn btn-gold">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
