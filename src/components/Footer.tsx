import { Link } from "@tanstack/react-router";
import { siteConfig, whatsappLink } from "@/config/site";
import { serviceCategories } from "@/data/services";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-black px-5 pb-10 pt-16 text-off-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img
            src={siteConfig.logoUrl}
            alt={`${siteConfig.name} logo`}
            width={72}
            height={72}
            loading="lazy"
            className="h-16 w-16 object-contain"
          />
          <p className="mt-5 font-serif text-xl">
            sNeha&apos;s <span className="text-gold">Makeover</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-off-white/60">
            A personal beauty and makeover studio for makeup, hair, nails and skin care.
          </p>
          <p className="mt-4 font-serif text-sm italic text-gold/85">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h3 className="eyebrow text-gold">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm text-off-white/70">
            {[
              { to: "/", label: "Home" },
              { to: "/services", label: "Services" },
              { to: "/products", label: "Product Catalogue" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="eyebrow text-gold">Services</h3>
          <ul className="mt-5 space-y-3 text-sm text-off-white/70">
            {serviceCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/services"
                  hash={c.slug}
                  className="transition-colors hover:text-gold"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-off-white/70">
            <li>{siteConfig.address}</li>
            <li>{siteConfig.phone}</li>
            <li>{siteConfig.email}</li>
            <li>{siteConfig.openingHours}</li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                Instagram {siteConfig.instagramHandle}
              </a>
            </li>
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-gold mt-6"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-off-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} sNeha&apos;s Makeover. All rights reserved.
        </p>
        <p>{siteConfig.note}</p>
      </div>
    </footer>
  );
}
