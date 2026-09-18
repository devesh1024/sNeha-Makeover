import { Link } from "@tanstack/react-router";
import { siteConfig, whatsappLink } from "@/config/site";
import { Reveal } from "./Reveal";

export function CTASection({
  title = "Ready for your next look?",
  description = siteConfig.tagline,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-black px-5 py-20 text-off-white sm:px-8 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-gold">{siteConfig.name}</p>
        <h2 className="mt-6 text-3xl leading-[1.15] sm:text-4xl md:text-5xl">{title}</h2>
        <div className="mx-auto mt-6 h-px w-16 bg-gold" aria-hidden="true" />
        <p className="mt-6 font-serif text-lg italic text-off-white/75">{description}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn btn-gold">
            Contact Us
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-gold"
          >
            WhatsApp Inquiry
          </a>
        </div>
      </Reveal>
    </section>
  );
}
