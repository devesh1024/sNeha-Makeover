import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || open
          ? "bg-black/95 backdrop-blur-sm border-b border-gold/20"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-8 md:py-4"
      >
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={`${siteConfig.name} home`}>
          <img
            src={siteConfig.logoUrl}
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <span className="truncate font-serif text-base tracking-wide text-off-white sm:text-lg">
            sNeha&apos;s <span className="text-gold">Makeover</span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="link-underline text-xs uppercase tracking-[0.18em] text-off-white/80 transition-colors hover:text-off-white"
              data-active={pathname === l.to}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className="btn btn-gold">
            Book an Appointment
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-off-white lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-500 ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-6 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-500 ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 top-[64px] z-40 flex flex-col bg-black px-6 pb-10 pt-8 lg:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.to} className="border-b border-white/10">
                <Link
                  to={l.to}
                  className="block py-4 font-serif text-2xl text-off-white"
                  data-active={pathname === l.to}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-gold mt-8 w-full">
            Book an Appointment
          </Link>
          <p className="mt-auto pt-10 font-serif text-sm italic text-gold/80">{siteConfig.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
